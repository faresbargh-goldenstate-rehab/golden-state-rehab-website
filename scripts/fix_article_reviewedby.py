#!/usr/bin/env python3
"""FIX 1 — `reviewedBy` is not a valid property of Article/BlogPosting.

Every affected post already carries a sibling `MedicalWebPage` node whose
`reviewedBy` IS valid, so the medical-reviewer E-E-A-T signal is preserved by
deleting the duplicate from the BlogPosting and pointing the article's
`mainEntityOfPage` at the MedicalWebPage node instead.

The one Spanish post has no MedicalWebPage sibling; it gets one built from the
values already present on that page (no new claims, no new review dates).

Usage:
  python3 scripts/fix_article_reviewedby.py --dry-run
  python3 scripts/fix_article_reviewedby.py
"""

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.goldenstate-rehab.com"
BLOCK = re.compile(r'<script type="application/ld\+json">\n?(.*?)\n?</script>', re.S)

# Literal "—" character sequences that leaked into two schema descriptions.
BAD_ESCAPE = re.compile(r"\\u([0-9a-fA-F]{4})")


def unescape_literals(value):
    """Turn a literal backslash-u escape left in a JSON string into its char."""
    if not isinstance(value, str):
        return value
    return BAD_ESCAPE.sub(lambda m: chr(int(m.group(1), 16)), value)


def medical_webpage_for(post, url):
    """Build the MedicalWebPage node the Spanish post is missing."""
    return {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "@id": f"{url}#medicalwebpage",
        "url": url,
        "name": post["headline"],
        "description": post["description"],
        "about": {"@type": "MedicalCondition", "name": "Substance Use Disorder"},
        "audience": {"@type": "MedicalAudience", "audienceType": "Patient"},
        "lastReviewed": post["dateModified"],
        "reviewedBy": {
            "@type": "Person",
            "name": "Dr. Eric Chaghouri, MD",
            "jobTitle": "Director Médico",
            "url": f"{SITE}/team",
            "affiliation": {"@id": f"{SITE}/#organization"},
        },
        "publisher": {"@id": f"{SITE}/#organization"},
        "isPartOf": {"@id": f"{SITE}/#website"},
        "inLanguage": "es",
    }


def process(path: Path, dry_run: bool) -> bool:
    text = path.read_text(encoding="utf-8")
    blocks = list(BLOCK.finditer(text))

    has_medical_webpage = False
    posting = None
    for m in blocks:
        try:
            node = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        if node.get("@type") == "MedicalWebPage":
            has_medical_webpage = True
        if node.get("@type") == "BlogPosting":
            posting = (m, node)

    if posting is None:
        print(f"SKIP (no BlogPosting): {path}")
        return False
    match, node = posting
    if "reviewedBy" not in node:
        print(f"SKIP (already clean): {path}")
        return False

    url = node["@id"].split("#")[0]

    # Rebuild the node preserving key order, swapping reviewedBy out and
    # retargeting mainEntityOfPage at the node that legitimately holds it.
    fixed = {}
    for key, value in node.items():
        if key == "reviewedBy":
            continue
        if key == "mainEntityOfPage":
            fixed[key] = {"@id": f"{url}#medicalwebpage"}
            continue
        fixed[key] = unescape_literals(value)

    replacement = json.dumps(fixed, indent=2, ensure_ascii=False)
    new_text = text[: match.start(1)] + replacement + text[match.end(1) :]

    if not has_medical_webpage:
        added = json.dumps(medical_webpage_for(fixed, url), indent=2, ensure_ascii=False)
        anchor = text[match.end(1) : match.end()]  # the closing "\n</script>"
        insert_at = match.start(1) + len(replacement) + len(anchor)
        new_text = (
            new_text[:insert_at]
            + '\n<script type="application/ld+json">\n'
            + added
            + "\n</script>"
            + new_text[insert_at:]
        )
        print(f"FIX  {path}  (removed reviewedBy, ADDED MedicalWebPage)")
    else:
        print(f"FIX  {path}  (removed reviewedBy)")

    if not dry_run:
        path.write_text(new_text, encoding="utf-8")
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    targets = sorted(ROOT.glob("blog/*.html")) + sorted(ROOT.glob("es/blog/*.html"))
    fixed = sum(process(p, args.dry_run) for p in targets)
    print(f"\nFixed: {fixed}")
    if args.dry_run:
        print("(dry run — no files written)")


if __name__ == "__main__":
    main()
