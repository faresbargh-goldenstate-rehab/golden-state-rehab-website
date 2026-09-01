#!/usr/bin/env python3
"""Build the Golden Guide chat widget's knowledge base.

Sources, in merge order:
  1. FAQPage JSON-LD blocks across the site's HTML (already compliance-reviewed
     copy — the house rule keeps schema text identical to on-page FAQ wording).
  2. One "routing" doc per page (title/meta/H1 -> short answer + deep link).
  3. scripts/chat_kb_overlay.json — hand-authored intents, safety copy,
     synonyms, quick actions, and extra docs (EN + ES).

Outputs data/chat-kb.en.json and data/chat-kb.es.json (committed; served with
the /* revalidate cache rule, so KB edits ship on deploy with no ?v= bump).

The build HARD-FAILS if any answer violates the locked insurance wording
(never "accepted"/"in-network" near a carrier name) or contains known-stale
copy. It also fails if an overlay deep link points at a page that doesn't
exist. Output is deterministic: run twice, diff clean.

Usage:
  python3 scripts/build_chat_kb.py            # build + report
  python3 scripts/build_chat_kb.py --check    # verify committed output is current
"""

import argparse
import hashlib
import json
import math
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OVERLAY = ROOT / "scripts" / "chat_kb_overlay.json"
OUT_DIR = ROOT / "data"

SKIP_FILES = {"404.html", "amenity-map.html", "intake-success.html"}
SKIP_DIRS = {"docs", "node_modules", ".git"}

MAX_ANSWER_CHARS = 620

STOPWORDS = {
    "en": {
        "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do",
        "does", "for", "from", "get", "has", "have", "how", "i", "if", "in",
        "is", "it", "its", "may", "me", "my", "of", "on", "or", "our", "so",
        "than", "that", "the", "their", "there", "they", "this", "to", "up",
        "was", "we", "what", "when", "which", "who", "will", "with", "you",
        "your", "am", "about", "into", "not",
    },
    "es": {
        "a", "al", "con", "como", "cual", "cuales", "de", "del", "el", "en",
        "es", "esta", "este", "hay", "la", "las", "lo", "los", "mas", "me",
        "mi", "mis", "no", "o", "para", "por", "que", "se", "si", "sin",
        "son", "su", "sus", "un", "una", "y", "yo", "les", "le",
    },
}

CARRIER_RE = r"aetna|cigna|anthem|blue shield|blue cross|united ?health\w*|optum"
INSURANCE_VIOLATIONS = [
    # "accepted"/"in-network" within a sentence of a carrier name, either order.
    re.compile(
        r"(?:%s)[^.?!]{0,80}\b(?:accept\w*|in[- ]network)\b"
        r"|\b(?:accept\w*|in[- ]network)\b[^.?!]{0,80}(?:%s)"
        % (CARRIER_RE, CARRIER_RE),
        re.I,
    ),
    re.compile(r"\bwe accept\b", re.I),
    re.compile(r"\baccepts? (?:most|all|your) (?:major )?insurance\b", re.I),
    re.compile(r"contact us for our specific address", re.I),
    # Spanish equivalents of the banned "we accept [insurance]" phrasing.
    re.compile(
        r"\baceptamos\b[^.?!]{0,80}(?:seguro|plane|aseguranza|%s)"
        r"|(?:seguro|aseguranza|%s)[^.?!]{0,80}\baceptamos\b"
        % (CARRIER_RE, CARRIER_RE),
        re.I,
    ),
]

TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")


def strip_html(text):
    return WS_RE.sub(" ", TAG_RE.sub(" ", text)).strip()


def normalize(text):
    """Lowercase, strip diacritics and punctuation. Mirrors chat.js norm()."""
    text = unicodedata.normalize("NFD", text.lower())
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]+", " ", text)


def tokenize(text, lang):
    stop = STOPWORDS[lang]
    out = []
    for tok in normalize(text).split():
        if tok in stop or len(tok) < 2:
            continue
        if len(tok) > 3 and tok.endswith("s"):
            tok = tok[:-1]
        if tok not in out:
            out.append(tok)
    return out


def clean_url(path):
    """Repo-relative file path -> the clean URL Cloudflare Pages serves."""
    rel = path.relative_to(ROOT).as_posix()
    if rel.endswith("index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel[: -len(".html")]


def page_lang(path):
    rel = path.relative_to(ROOT).as_posix()
    return "es" if rel == "es" or rel.startswith("es/") else "en"


def iter_pages():
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] in SKIP_DIRS or rel.name in SKIP_FILES:
            continue
        yield path


def extract_jsonld(html):
    for block in re.findall(
        r'<script type="application/ld\+json">(.*?)</script>', html, re.S
    ):
        try:
            data = json.loads(block)
        except ValueError:
            continue
        items = data if isinstance(data, list) else data.get("@graph", [data])
        for item in items:
            if isinstance(item, dict):
                yield item


def extract_faq_pairs(html):
    for item in extract_jsonld(html):
        if item.get("@type") != "FAQPage":
            continue
        for q in item.get("mainEntity", []):
            name = strip_html(q.get("name", ""))
            answer = strip_html(q.get("acceptedAnswer", {}).get("text", ""))
            if name and answer:
                yield name, answer


def extract_meta(html):
    title = re.search(r"<title>(.*?)</title>", html, re.S)
    desc = re.search(
        r'<meta name="description" content="([^"]*)"', html
    )
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    return (
        strip_html(title.group(1)) if title else "",
        strip_html(desc.group(1)) if desc else "",
        strip_html(h1.group(1)) if h1 else "",
    )


def truncate_answer(text):
    if len(text) <= MAX_ANSWER_CHARS:
        return text
    cut = text[:MAX_ANSWER_CHARS]
    dot = cut.rfind(". ")
    return cut[: dot + 1] if dot > 200 else cut.rstrip() + "…"


def slug_tokens(url, lang):
    toks = []
    for seg in url.strip("/").split("/"):
        if seg in ("es", "blog"):
            continue
        toks.extend(tokenize(seg.replace("-", " "), lang))
    return toks


def violates(text):
    for rx in INSURANCE_VIOLATIONS:
        if rx.search(text):
            return rx.pattern[:50]
    return None


def check_compliance(doc_id, text, errors):
    hit = violates(text)
    if hit:
        errors.append("compliance violation in %s: %r matched %s"
                      % (doc_id, hit, text[:120]))


def build_lang(lang, overlay, stats, errors):
    exclude = {q.strip() for q in overlay.get("exclude_questions", [])}
    docs = []
    seen_answers = {}

    for path in iter_pages():
        if page_lang(path) != lang:
            continue
        html = path.read_text(encoding="utf-8")
        url = clean_url(path)
        title, desc, h1 = extract_meta(html)
        link_label = h1 or title or url

        # Routing doc: lets "tell me about IOP" resolve to a page summary.
        # Site-authored copy that violates the locked insurance wording is
        # DROPPED (reported below) — the hedged overlay intents answer those
        # queries instead. Only overlay-authored copy hard-fails the build.
        if desc and violates(desc):
            stats["dropped"].append(url + "#page")
            desc = ""
        if desc:
            docs.append({
                "id": url.strip("/") + "#page" if url != "/" else "home#page",
                "q": title or h1,
                "qt": tokenize((title or "") + " " + (h1 or ""), lang),
                "kw": slug_tokens(url, lang) or (["home"] if url == "/" else []),
                "a": truncate_answer(desc),
                "url": url,
                "link_label": link_label,
            })

        n = 0
        for question, answer in extract_faq_pairs(html):
            if question.strip() in exclude:
                stats["excluded"] += 1
                continue
            if violates(answer):
                stats["dropped"].append("%s (%s)" % (url, question[:50]))
                continue
            ahash = hashlib.sha1(normalize(answer).encode()).hexdigest()
            if ahash in seen_answers:
                stats["deduped"] += 1
                continue
            seen_answers[ahash] = url
            n += 1
            docs.append({
                "id": "%s#q%d" % (url.strip("/") or "home", n),
                "q": question,
                "qt": tokenize(question, lang),
                "kw": slug_tokens(url, lang),
                "a": truncate_answer(answer),
                "url": url,
                "link_label": link_label,
            })
        stats["faq_docs"] += n

    for doc in overlay["extra_docs"].get(lang, []):
        entry = dict(doc)
        entry["qt"] = tokenize(entry["q"], lang)
        entry["kw"] = [t for k in entry.get("kw", [])
                       for t in tokenize(k, lang)] or entry["qt"][:4]
        docs.append(entry)

    # Overlay-authored copy must be clean — hard-fail on violation. (Extracted
    # site copy was already filtered above; this is a belt-and-suspenders sweep
    # over the final doc list plus every intent answer.)
    for doc in docs:
        check_compliance(doc["id"], doc["a"], errors)
    for intent in overlay["intents"].get(lang, []):
        check_compliance(intent["id"], intent["answer"], errors)

    # Validate regexes compile (Python as a proxy for JS — only shared syntax
    # is used in the overlay).
    safety = overlay["safety"][lang]
    for rx_owner in ([safety["crisis"], safety["medical"]]
                     + overlay["intents"].get(lang, [])):
        pattern = rx_owner.get("re")
        if pattern:
            try:
                re.compile(pattern)
            except re.error as exc:
                errors.append("bad regex in %s: %s"
                              % (rx_owner.get("id", "safety"), exc))

    # Validate every overlay deep link resolves to a real page.
    def check_url(owner, href):
        if not href or href.startswith("tel:") or href == "/":
            return
        rel = href.strip("/")
        if not ((ROOT / (rel + ".html")).exists()
                or (ROOT / rel / "index.html").exists()):
            errors.append("dead link in %s: %s" % (owner, href))

    for intent in overlay["intents"].get(lang, []):
        check_url(intent["id"], intent.get("url"))
        check_url(intent["id"], intent.get("cta", {}).get("href"))
    for doc in overlay["extra_docs"].get(lang, []):
        check_url(doc["id"], doc.get("url"))
    for action in overlay["quick_actions"][lang]:
        check_url("quick_action:" + action["id"], action["href"])

    # IDF over qt+kw of all docs.
    df = {}
    for doc in docs:
        for tok in set(doc["qt"]) | set(doc["kw"]):
            df[tok] = df.get(tok, 0) + 1
    n_docs = max(len(docs), 1)
    idf = {t: round(math.log(1 + n_docs / c), 2) for t, c in sorted(df.items())}

    docs.sort(key=lambda d: d["id"])
    return {
        "v": 1,
        "lang": lang,
        "threshold": 4.5,
        "stop": sorted(STOPWORDS[lang]),
        "synonyms": overlay["synonyms"].get(lang, {}),
        "safety": overlay["safety"][lang],
        "quick_actions": overlay["quick_actions"][lang],
        "intents": overlay["intents"].get(lang, []),
        "idf": idf,
        "docs": docs,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="fail if committed data/ output is out of date")
    args = ap.parse_args()

    try:
        overlay = json.loads(OVERLAY.read_text(encoding="utf-8"))
    except ValueError as exc:
        sys.exit("error: overlay is not valid JSON: %s" % exc)

    errors = []
    outputs = {}
    for lang in ("en", "es"):
        stats = {"faq_docs": 0, "excluded": 0, "deduped": 0, "dropped": []}
        kb = build_lang(lang, overlay, stats, errors)
        rendered = json.dumps(kb, ensure_ascii=False, sort_keys=True,
                              separators=(",", ":"))
        outputs[lang] = rendered
        print("chat-kb.%s.json: %d docs (%d from FAQ schema), "
              "%d intents, %d excluded, %d deduped, %d KB"
              % (lang, len(kb["docs"]), stats["faq_docs"],
                 len(kb["intents"]), stats["excluded"], stats["deduped"],
                 len(rendered.encode("utf-8")) // 1024))
        if stats["dropped"]:
            print("  dropped %d non-compliant site answer(s) "
                  "(fix the source pages; the hedged intents answer these):"
                  % len(stats["dropped"]))
            for item in stats["dropped"]:
                print("    -", item)

    if errors:
        for e in errors:
            print("ERROR:", e, file=sys.stderr)
        sys.exit("build failed: %d error(s)" % len(errors))

    if args.check:
        stale = [lang for lang in outputs
                 if not (OUT_DIR / ("chat-kb.%s.json" % lang)).exists()
                 or (OUT_DIR / ("chat-kb.%s.json" % lang)).read_text(
                     encoding="utf-8") != outputs[lang]]
        if stale:
            sys.exit("stale KB output for: %s — rerun the build" % ", ".join(stale))
        print("check passed: committed KB matches sources")
        return

    OUT_DIR.mkdir(exist_ok=True)
    for lang, rendered in outputs.items():
        (OUT_DIR / ("chat-kb.%s.json" % lang)).write_text(
            rendered, encoding="utf-8")


if __name__ == "__main__":
    main()
