#!/usr/bin/env python3
"""Add MedicalWebPage reviewedBy/lastReviewed schema to pages that show a
visible 'Medically reviewed by' byline but carry no structured equivalent.

The lastReviewed value mirrors each page's ALREADY-VISIBLE review date — it
does not assert a new review. Pages whose visible and structured dates already
agree are left untouched.

Usage:
  python3 scripts/add_reviewed_by.py --dry-run
  python3 scripts/add_reviewed_by.py
"""

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://www.goldenstate-rehab.com"
REVIEWER = {
    "@type": "Person",
    "name": "Dr. Eric Chaghouri, MD",
    "jobTitle": "Medical Director",
    "worksFor": {"@id": f"{SITE}/#organization"},
}

# page path -> (schema name, lastReviewed mirroring the visible "Updated ..." line)
TARGETS = {
    "programs/php.html": ("Partial Hospitalization Program (PHP) in Los Angeles", "2026-07-07"),
    "programs/iop.html": ("Intensive Outpatient Program (IOP) in Los Angeles", "2026-07-07"),
    "programs/telehealth.html": ("Telehealth Rehab in Los Angeles", "2026-07-07"),
    "programs/outpatient-rehab.html": ("Outpatient Drug Rehab in Los Angeles", "2026-07-07"),
    "programs/individual-therapy.html": ("Individual Therapy in Los Angeles", "2026-07-07"),
    "programs/group-therapy.html": ("Group Therapy in Los Angeles", "2026-07-07"),
    "programs/medication-management.html": ("Medication Management in Los Angeles", "2026-07-07"),
    "programs/holistic-therapies.html": ("Holistic Therapies in Los Angeles", "2026-07-07"),
    "programs/alumni.html": ("Alumni Program in Los Angeles", "2026-07-07"),
    "faq.html": ("Frequently Asked Questions", "2026-07-07"),
}


def canonical_of(text: str) -> str | None:
    marker = 'rel="canonical" href="'
    i = text.find(marker)
    if i == -1:
        return None
    start = i + len(marker)
    return text[start : text.index('"', start)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    added = skipped = 0
    for rel, (name, reviewed) in TARGETS.items():
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        if '"reviewedBy"' in text:
            print(f"SKIP (already has reviewedBy): {rel}")
            skipped += 1
            continue
        url = canonical_of(text)
        if not url:
            print(f"SKIP (no canonical): {rel}")
            skipped += 1
            continue
        node = {
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            "name": name,
            "url": url,
            "lastReviewed": reviewed,
            "reviewedBy": REVIEWER,
            "isPartOf": {"@id": f"{SITE}/#website"},
        }
        block = (
            '<script type="application/ld+json">\n'
            + json.dumps(node, indent=2, ensure_ascii=False)
            + "\n</script>\n"
        )
        if "</body>" not in text:
            print(f"SKIP (no </body>): {rel}")
            skipped += 1
            continue
        text = text.replace("</body>", block + "</body>", 1)
        print(f"ADD  {rel}  lastReviewed={reviewed}")
        added += 1
        if not args.dry_run:
            path.write_text(text, encoding="utf-8")

    print(f"\nAdded: {added}  Skipped: {skipped}")
    if args.dry_run:
        print("(dry run — no files written)")


if __name__ == "__main__":
    main()
