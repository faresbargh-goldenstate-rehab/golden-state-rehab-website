#!/usr/bin/env python3
"""Reorder the About menu and give the mobile menu all three About pages (idempotent).

Rules (English pages only; es/ and the Spanish landing keep their own nav):
  1. Desktop dropdown and footer Explore trio: Our History / Meet the Team /
     Why Choose Us becomes Why Choose Us / Meet the Team / Our History,
     keeping each page's href prefix (bare, ../ or /) and indentation.
  2. Mobile menu: the single "About Us" link becomes a labeled group with the
     three pages, followed by a divider. Uses the existing .nav-mobile-group,
     .nav-mobile-group-label and .nav-mobile-divider styles, so no CSS change
     (and no styles.min.css cache bump) is needed. main.js still marks the
     current page's link active and closes the menu on tap.

Usage:
  python3 scripts/update_about_nav.py --dry-run
  python3 scripts/update_about_nav.py
"""

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXCLUDED_DIRS = {"es", "docs", "scripts", "node_modules", ".git", "functions"}

# Old order, as written by consolidate_about_nav.py. Group 'sep' keeps the
# whitespace between links (newline + indent in the dropdown, nothing in the footer).
OLD_ORDER_RE = re.compile(
    r'<a href="(?P<p>[^"]*)our-story">Our History</a>(?P<sep>\s*)'
    r'<a href="(?P=p)team">Meet the Team</a>(?P=sep)'
    r'<a href="(?P=p)about">Why Choose Us</a>'
)
MOBILE_NAV_RE = re.compile(r'(<nav class="nav-mobile"[^>]*>)(.*?)(</nav>)', re.S)
MOBILE_ABOUT_RE = re.compile(r'(?P<ind>[ \t]*)<a href="(?P<p>[^"]*)about"(?: class="active")?>About Us</a>\n')


def reorder(m: re.Match) -> str:
    p, sep = m.group("p"), m.group("sep")
    return (
        f'<a href="{p}about">Why Choose Us</a>{sep}'
        f'<a href="{p}team">Meet the Team</a>{sep}'
        f'<a href="{p}our-story">Our History</a>'
    )


def mobile_group(m: re.Match) -> str:
    ind, p = m.group("ind"), m.group("p")
    return (
        f'{ind}<div class="nav-mobile-group">\n'
        f'{ind}  <div class="nav-mobile-group-label">About Us</div>\n'
        f'{ind}  <a href="{p}about">Why Choose Us</a>\n'
        f'{ind}  <a href="{p}team">Meet the Team</a>\n'
        f'{ind}  <a href="{p}our-story">Our History</a>\n'
        f'{ind}</div>\n'
        f'{ind}<div class="nav-mobile-divider"></div>\n'
    )


def rewrite_mobile(m: re.Match):
    inner, n = MOBILE_ABOUT_RE.subn(mobile_group, m.group(2), count=1)
    rewrite_mobile.count += n
    return m.group(1) + inner + m.group(3)


def apply_rules(text: str):
    changes = []
    text, n = OLD_ORDER_RE.subn(reorder, text)
    if n:
        changes.append(f"order x{n}")
    rewrite_mobile.count = 0
    text = MOBILE_NAV_RE.sub(rewrite_mobile, text, count=1)
    if rewrite_mobile.count:
        changes.append("mobile group")
    return text, changes


def target_files():
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] in EXCLUDED_DIRS:
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
