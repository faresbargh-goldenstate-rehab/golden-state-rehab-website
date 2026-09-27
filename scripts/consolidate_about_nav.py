#!/usr/bin/env python3
"""Consolidate the About section from four pages to three (idempotent).

Our Facility merged into /our-story (#facility); /our-facility 301s there.

Rules (English pages only; es/ is left alone):
  1. Nav dropdown: Our Story / Our Facility / Why Golden State Rehab / Our Team
     becomes Our History / Meet the Team / Why Choose Us, keeping each page's
     href prefix (bare, ../ or /).
  2. Footer Explore column: About Us / Our Team / Our Facility becomes
     Our History / Meet the Team / Why Choose Us.
  3. Any remaining link to our-facility points at /our-story#facility.

Usage:
  python3 scripts/consolidate_about_nav.py --dry-run
  python3 scripts/consolidate_about_nav.py
"""

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXCLUDED_DIRS = {"es", "docs", "scripts", "node_modules", ".git", "functions"}
FACILITY_ANCHOR = "/our-story#facility"

DROPDOWN_RE = re.compile(
    r'(?P<ind>[ \t]*)<a href="(?P<p>[^"]*)our-story">Our Story</a>\s*'
    r'<a href="(?P=p)our-facility">Our Facility</a>\s*'
    r'<a href="(?P=p)about">Why Golden State Rehab</a>\s*'
    r'<a href="(?P=p)team">Our Team</a>'
)
FOOTER_OLD = '<a href="/about">About Us</a><a href="/team">Our Team</a><a href="/our-facility">Our Facility</a>'
FOOTER_NEW = '<a href="/our-story">Our History</a><a href="/team">Meet the Team</a><a href="/about">Why Choose Us</a>'
FACILITY_HREF_RE = re.compile(r'href="(?:\.\./|/)?our-facility(?:\.html)?"')


def rewrite_dropdown(m: re.Match) -> str:
    ind, p = m.group("ind"), m.group("p")
    return (
        f'{ind}<a href="{p}our-story">Our History</a>\n'
        f'{ind}<a href="{p}team">Meet the Team</a>\n'
        f'{ind}<a href="{p}about">Why Choose Us</a>'
    )


def apply_rules(text: str):
    changes = []
    text, n = DROPDOWN_RE.subn(rewrite_dropdown, text)
    if n:
        changes.append(f"dropdown x{n}")
    n = text.count(FOOTER_OLD)
    if n:
        text = text.replace(FOOTER_OLD, FOOTER_NEW)
        changes.append(f"footer x{n}")
    text, n = FACILITY_HREF_RE.subn(f'href="{FACILITY_ANCHOR}"', text)
    if n:
        changes.append(f"facility link x{n}")
    return text, changes


def target_files():
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] in EXCLUDED_DIRS or rel.name == "our-facility.html":
            continue
        yield path


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--dry-run", action="store_true", help="report changes without writing")
    args = parser.parse_args()

    touched = 0
    for path in target_files():
        original = path.read_text(encoding="utf-8")
        updated, changes = apply_rules(original)
        if not changes:
            continue
        touched += 1
        print(f"{path.relative_to(ROOT)}: {', '.join(changes)}")
        if not args.dry_run:
            path.write_text(updated, encoding="utf-8")
    print(f"\n{touched} file(s) {'would change' if args.dry_run else 'changed'}.")


if __name__ == "__main__":
    main()
