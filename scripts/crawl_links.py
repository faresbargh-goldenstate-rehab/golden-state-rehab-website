#!/usr/bin/env python3
"""Site link-graph crawler and integrity checker for goldenstate-rehab.com.

Usage:
  python3 scripts/crawl_links.py                 # crawl, check, print summary
  python3 scripts/crawl_links.py --json OUT.json # also write full link-graph report
  python3 scripts/crawl_links.py --strict        # exit 1 on broken links / bad JSON-LD

Checks:
  1. Every internal href resolves to a real file (clean URLs: `x` -> x.html,
     `x/` -> x/index.html), honoring _redirects.
  2. Every <script type="application/ld+json"> block parses as JSON.
  3. Emits per-page in-body outbound/inbound counts. "In-body" excludes links
     inside <nav>, <footer>, and <head> (same methodology as the Aug 10 audit).
"""

import argparse
import json
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXCLUDED_DIRS = {"docs", "scripts", "node_modules", ".git", "functions"}
EXTERNAL_PREFIXES = (
    "http://", "https://", "mailto:", "tel:", "sms:", "javascript:", "data:", "geo:",
)


class PageParser(HTMLParser):
    """Collects anchors (with body/boilerplate context), H1 text, and JSON-LD blocks."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []  # (href, in_body)
        self.h1 = None
        self.jsonld = []  # raw script contents
        self._nav = 0
        self._footer = 0
        self._head = 0
        self._h1 = 0
        self._h1_parts = []
        self._script_type = None
        self._script_parts = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "nav":
            self._nav += 1
        elif tag == "footer":
            self._footer += 1
        elif tag == "head":
            self._head += 1
        elif tag == "h1" and self.h1 is None:
            self._h1 = 1
        elif tag == "script":
            self._script_type = d.get("type")
            self._script_parts = []
        elif tag == "a":
            href = d.get("href")
            if href:
                in_body = self._nav == 0 and self._footer == 0 and self._head == 0
                self.links.append((href, in_body))

    def handle_endtag(self, tag):
        if tag == "nav" and self._nav:
            self._nav -= 1
        elif tag == "footer" and self._footer:
            self._footer -= 1
        elif tag == "head" and self._head:
            self._head -= 1
        elif tag == "h1" and self._h1:
            self._h1 = 0
            if self.h1 is None:
                self.h1 = " ".join("".join(self._h1_parts).split())
        elif tag == "script":
            if self._script_type == "application/ld+json":
                self.jsonld.append("".join(self._script_parts))
            self._script_type = None

    def handle_data(self, data):
        if self._h1:
            self._h1_parts.append(data)
        if self._script_type is not None:
            self._script_parts.append(data)


def load_redirect_sources():
    sources = set()
    redirects = ROOT / "_redirects"
    if redirects.exists():
        for line in redirects.read_text().splitlines():
            parts = line.split()
            if len(parts) >= 2 and not line.strip().startswith("#"):
                sources.add(parts[0].rstrip("/") or "/")
    return sources


def site_files():
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] in EXCLUDED_DIRS:
            continue
        yield path, rel


def url_of(rel: Path) -> str:
    """Canonical clean URL for a file, e.g. programs/php.html -> /programs/php."""
    s = "/" + rel.as_posix()
    if s.endswith("/index.html"):
        return s[: -len("index.html")]
    if s.endswith(".html"):
        return s[: -len(".html")]
    return s


def resolve(href: str, containing_dir: Path, redirect_sources: set):
    """Return canonical URL string if href resolves internally, else None if broken.

    Returns (kind, value): kind in {"external", "page", "asset", "redirect", "broken"}.
    """
    if href.startswith(EXTERNAL_PREFIXES) or href.startswith("#"):
        return ("external", href)
    path_part = href.split("#", 1)[0].split("?", 1)[0]
    if not path_part:
        return ("external", href)  # pure fragment/query
    if path_part.startswith("/"):
        base = ROOT
        rel_str = path_part.lstrip("/")
    else:
        base = containing_dir
        rel_str = path_part
    target = (base / rel_str).resolve()
    try:
        target.relative_to(ROOT)
    except ValueError:
        return ("broken", href)

    candidates = []
    if rel_str.endswith("/") or rel_str == "":
        candidates.append(target / "index.html")
    else:
        candidates.append(target)  # literal file (assets, .html, .xml, images)
        candidates.append(target.with_name(target.name + ".html"))
        candidates.append(target / "index.html")
    for cand in candidates:
        if cand.is_file():
            rel = cand.relative_to(ROOT)
            if cand.suffix == ".html":
                return ("page", url_of(rel))
            return ("asset", "/" + rel.as_posix())
    clean = "/" + path_part.strip("/").rstrip("/")
    if clean.rstrip("/") in redirect_sources or clean in redirect_sources:
        return ("redirect", clean)
    return ("broken", href)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", metavar="OUT")
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()

    redirect_sources = load_redirect_sources()
    pages = {}
    broken = []
    bad_jsonld = []
    inbound_body = {}

    for path, rel in site_files():
        parser = PageParser()
        try:
            parser.feed(path.read_text(encoding="utf-8"))
        except Exception as exc:  # parse failure is a finding, not a crash
            broken.append((rel.as_posix(), f"<parse error: {exc}>"))
            continue
        url = url_of(rel)
        body_out, boiler_out = [], []
        for href, in_body in parser.links:
            kind, value = resolve(href, path.parent, redirect_sources)
            if kind == "broken":
                broken.append((rel.as_posix(), href))
            elif kind == "page":
                (body_out if in_body else boiler_out).append(value)
        for i, block in enumerate(parser.jsonld):
            try:
                json.loads(block)
            except json.JSONDecodeError as exc:
                bad_jsonld.append((rel.as_posix(), i, str(exc)))
        pages[url] = {
            "file": rel.as_posix(),
            "h1": parser.h1,
            "body_out": sorted(set(body_out)),
            "body_out_total": len(body_out),
            "boilerplate_out": sorted(set(boiler_out)),
            "jsonld_blocks": len(parser.jsonld),
        }

    for url, info in pages.items():
        for target in info["body_out"]:
            if target != url:
                inbound_body.setdefault(target, set()).add(url)
    for url, info in pages.items():
        info["body_in"] = sorted(inbound_body.get(url, set()))
        info["body_in_count"] = len(inbound_body.get(url, set()))

    en_pages = {u: p for u, p in pages.items() if not u.startswith("/es/")}
    orphans = [
        u for u, p in en_pages.items()
        if p["body_in_count"] == 0 and u not in ("/", "/404")
    ]

    print(f"Pages crawled: {len(pages)} ({len(en_pages)} EN)")
    print(f"Broken internal links: {len(broken)}")
    for f, href in broken:
        print(f"  BROKEN  {f}  ->  {href}")
    print(f"Invalid JSON-LD blocks: {len(bad_jsonld)}")
    for f, i, err in bad_jsonld:
        print(f"  BAD-LD  {f}  block#{i}  {err}")
    home = pages.get("/", {})
    print(f"Homepage in-body outbound (unique pages): {len(home.get('body_out', []))}")
    print(f"EN orphan pages (0 in-body inbound): {len(orphans)}")
    for u in sorted(orphans):
        print(f"  ORPHAN  {u}")

    if args.json:
        out = Path(args.json)
        out.write_text(json.dumps(pages, indent=1, sort_keys=True))
        print(f"Report written: {out}")

    if args.strict and (broken or bad_jsonld):
        sys.exit(1)


if __name__ == "__main__":
    main()
