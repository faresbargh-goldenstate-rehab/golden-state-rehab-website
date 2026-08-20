#!/usr/bin/env python3
"""FIXES 5, 6, 7 — the three trust-bar / footer link defects, all shared components.

  5. The DHCS badge anchored straight at /images/dhcs-license.jpg, so crawlers
     followed it into a dead-end image. It now points at the /license page,
     which shows the same certificate.
  6. The Joint Commission seal links to a site that 403s bots. The link is
     legitimate accreditation proof and stays; it just gains rel="nofollow" so
     the blocked crawl stops reading as a site-quality signal.
  7. sapccms.dhcs.ca.gov is NXDOMAIN on every public resolver — genuinely dead,
     not bot-blocked. Repointed at the live DHCS SUD directories page.

Visible link text, phone numbers and CTAs are untouched.

Usage:
  python3 scripts/fix_trust_links.py --dry-run
  python3 scripts/fix_trust_links.py
"""

import argparse
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

DEAD_SAPC = "https://sapccms.dhcs.ca.gov/DirectoryofProviders/"
LIVE_DHCS = "https://www.dhcs.ca.gov/providers-partners/directories-for-substance-use-disorder-services/"

# (label, pattern, replacement)
RULES = [
    # Fix 5 — retarget the licence anchor at the new crawlable page.
    ("fix5-license-href",
     re.compile(r'href="/images/dhcs-license\.jpg"'),
     'href="/license"'),

    # Fix 6 — the seal link already carries noopener/noreferrer; add nofollow.
    ("fix6-jc-rel",
     re.compile(r'(<a\s+)rel="noopener noreferrer"(\s+href="https://www\.jointcommission\.org/")'),
     r'\1rel="noopener noreferrer nofollow"\2'),

    # Fix 7 — swap the dead host, and nofollow the external directory.
    ("fix7-sapc-href",
     re.compile(r'href="' + re.escape(DEAD_SAPC) + r'"'),
     'href="' + LIVE_DHCS + '"'),
    ("fix7-sapc-rel",
     re.compile(r'(href="' + re.escape(LIVE_DHCS) + r'"\s+target="_blank"\s+)rel="noopener"'),
     r'\1rel="noopener nofollow"'),
]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    tally: Counter[str] = Counter()
    touched = 0

    for path in sorted(ROOT.rglob("*.html")):
        if ".git" in path.parts or "docs" in path.parts:
            continue
        text = original = path.read_text(encoding="utf-8")
        for label, pattern, repl in RULES:
            text, n = pattern.subn(repl, text)
            tally[label] += n
        if text != original:
            touched += 1
            if not args.dry_run:
                path.write_text(text, encoding="utf-8")

    for label, _, _ in RULES:
        print(f"{label:<20} {tally[label]:>4} replacement(s)")
    print(f"\nFiles touched: {touched}")
    if args.dry_run:
        print("(dry run — no files written)")


if __name__ == "__main__":
    main()
