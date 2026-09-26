#!/usr/bin/env python3
"""Point the Joint Commission seal at our accreditation listing; drop nofollow
from the accreditor and licensor links.

  1. Every Joint Commission anchor linked the jointcommission.org homepage,
     which proves nothing. It now opens the Golden State listing in their
     "Find accredited organizations" directory, so the claim is one click
     from verified.
  2. The credential's JSON-LD "url" (EducationalOccupationalCredential) points
     at the same listing. "recognizedBy" keeps the homepage — it names the
     organisation, not our credential.
  3. rel="nofollow" comes off the Joint Commission and DHCS anchors. It was
     added (scripts/fix_trust_links.py, fixes 6-7) to quiet Semrush's 403
     warning on jointcommission.org, but nofollow reads as "we don't vouch
     for this" on links to our own accreditor and licensor. Their site still
     403s crawlers, so Semrush will report it — a known false positive.

Visible link text, classes and noopener/noreferrer are untouched.

Usage:
  python3 scripts/fix_accreditation_links.py --dry-run
  python3 scripts/fix_accreditation_links.py
"""

import argparse
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

JC_HOME = "https://www.jointcommission.org/"
JC_LISTING = (
    "https://www.jointcommission.org/en-us/about-us/recognizing-excellence/"
    "find-accredited-organizations/750952"
)

ANCHOR = re.compile(r"<a\s[^>]*>")
JC_HREF = 'href="' + JC_HOME + '"'
DHCS_HREF = re.compile(r'href="https://www\.dhcs\.ca\.gov/')
NOFOLLOW = re.compile(r'(rel="[^"]*?)\s+nofollow(?=[\s"])')

# The credential's own url follows credentialCategory — both the multi-line
# and the single-line JSON-LD layouts match; recognizedBy's url does not.
CREDENTIAL_URL = re.compile(
    r'("credentialCategory":\s*"accreditation",\s*"url":\s*)"'
    + re.escape(JC_HOME) + '"'
)


def fix_anchor(tag: str, tally: Counter) -> str:
    if JC_HREF in tag:
        tally["jc-href"] += 1
        tag = tag.replace(JC_HREF, 'href="' + JC_LISTING + '"')
    elif not DHCS_HREF.search(tag):
        return tag
    tag, n = NOFOLLOW.subn(r"\1", tag)
    tally["nofollow-removed"] += n
    return tag


def fix_text(text: str, tally: Counter) -> str:
    text = ANCHOR.sub(lambda m: fix_anchor(m.group(0), tally), text)
    text, n = CREDENTIAL_URL.subn(r'\1"' + JC_LISTING + '"', text)
    tally["schema-credential-url"] += n
    return text


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    tally: Counter[str] = Counter()
    touched = 0

    for path in sorted(ROOT.rglob("*.html")):
        if ".git" in path.parts or "docs" in path.parts:
            continue
        original = path.read_text(encoding="utf-8")
        text = fix_text(original, tally)
        if text != original:
            touched += 1
            if not args.dry_run:
                path.write_text(text, encoding="utf-8")

    for label in ("jc-href", "nofollow-removed", "schema-credential-url"):
        print(f"{label:<22} {tally[label]:>4} replacement(s)")
    print(f"\nFiles touched: {touched}")
    if args.dry_run:
        print("(dry run — no files written)")


if __name__ == "__main__":
    main()
