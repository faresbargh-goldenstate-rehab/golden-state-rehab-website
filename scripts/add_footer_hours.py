#!/usr/bin/env python3
"""Publish the Google Business Profile hours (open 24 hours, every day) sitewide.

Two changes per page, both idempotent:

  1. Footer: inserts a `.footer-hours` list (Monday through Sunday, one row per
     day, "Open 24 hours", then a call-or-text line) into the `.footer-visit`
     band, between the address text and the map. Reruns rewrite an existing
     band in place, so copy changes here roll out sitewide. English and Spanish copies are chosen from `<html lang>`.
     The per-day rows mirror how the GBP lists hours, so the visible NAP+hours
     block matches the profile line for line.

  2. Schema: rewrites the organization node's old `openingHoursSpecification`
     (Mon-Sat 09:00-18:00, which contradicted the GBP) to all seven days,
     00:00-23:59. That is Google's documented way to mark a LocalBusiness as
     open 24 hours. The ContactPoint `hoursAvailable` block already uses it and
     is left alone.

The band's styles live in css/styles.css (`.footer-hours*`). Remember the min
mirror and the `?v=` bump when they change.

Usage:
  python3 scripts/add_footer_hours.py --dry-run
  python3 scripts/add_footer_hours.py
"""

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Same exclusions as add_footer_map.py: internal docs never get the site chrome,
# and probe-faq.html is an untracked scratch copy.
EXCLUDE_DIRS = {"docs"}
EXCLUDE_FILES = {"probe-faq.html"}

MARKER = 'class="footer-hours"'
ANCHOR = '<div class="footer-visit-map">'

DAYS = {
    "en": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "es": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
}
PHONE_HREF = "tel:+14242083120"
PHONE_TEXT = "(424)&nbsp;208-3120"
COPY = {
    "en": {
        "eyebrow": "Hours",
        "open": "Open 24 hours",
        "note": f'Call or text <a href="{PHONE_HREF}">{PHONE_TEXT}</a> any day, any time.',
    },
    "es": {
        "eyebrow": "Horario",
        "open": "Abierto las 24 horas",
        "note": f'Llame o envíe un texto al <a href="{PHONE_HREF}">{PHONE_TEXT}</a> cualquier día, a cualquier hora.',
    },
}

# The stale spec: Mon-Sat 09:00-18:00. Matches both the compact form used on
# most pages and the pretty-printed form on espanol.html.
OLD_SPEC_RE = re.compile(
    r'("openingHoursSpecification"\s*:\s*\[\s*\{\s*"@type"\s*:\s*"OpeningHoursSpecification"\s*,'
    r'\s*"dayOfWeek"\s*:\s*\[[^\]]*?"Friday")(\s*,\s*)"Saturday"(\s*\]\s*,'
    r'\s*"opens"\s*:\s*)"09:00"(\s*,\s*"closes"\s*:\s*)"18:00"'
)
LD_RE = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)


def render_hours(lang: str) -> str:
    c = COPY[lang]
    rows = "".join(f"<div><dt>{day}</dt><dd>{c['open']}</dd></div>" for day in DAYS[lang])
    return (
        '<div class="footer-hours">'
        f'<div class="footer-visit-eyebrow">{c["eyebrow"]}</div>'
        f'<dl class="footer-hours-list">{rows}</dl>'
        f'<p class="footer-hours-note">{c["note"]}</p>'
        "</div>"
    )


def page_lang(text: str) -> str:
    m = re.search(r'<html[^>]*\blang="([a-z]{2})', text)
    return "es" if m and m.group(1) == "es" else "en"


# An existing band (with or without the call note) so reruns upgrade it in place.
BAND_RE = re.compile(r'<div class="footer-hours">.*?</dl>(?:<p class="footer-hours-note">.*?</p>)?</div>', re.S)


def add_hours_band(text: str) -> tuple[str, bool]:
    band = render_hours(page_lang(text))
    if MARKER in text:
        updated = BAND_RE.sub(lambda _: band, text, count=1)
        return updated, updated != text
    if ANCHOR not in text:
        return text, False
    return text.replace(ANCHOR, band + ANCHOR, 1), True


def fix_schema(text: str) -> tuple[str, int]:
    def repl(m: re.Match) -> str:
        sep = m.group(2)
        return (
            f'{m.group(1)}{sep}"Saturday"{sep}"Sunday"{m.group(3)}'
            f'"00:00"{m.group(4)}"23:59"'
        )

    return OLD_SPEC_RE.subn(repl, text)


def json_ld_valid(text: str) -> bool:
    try:
        for m in LD_RE.finditer(text):
            json.loads(m.group(1))
    except json.JSONDecodeError:
        return False
    return True


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    bands = specs = files = 0
    no_anchor = []
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] in EXCLUDE_DIRS or path.name in EXCLUDE_FILES:
            continue
        original = path.read_text(encoding="utf-8")
        if "<footer" not in original:
            continue

        text, added = add_hours_band(original)
        text, n_specs = fix_schema(text)
        if MARKER not in text:
            no_anchor.append(str(rel))
        if text == original:
            continue
        if not json_ld_valid(text):
            raise SystemExit(f"JSON-LD would break in {rel}; nothing written for it")

        bands += added
        specs += n_specs
        files += 1
        print(f"{'would update' if args.dry_run else 'updated'}: {rel}"
              f" (band={int(added)}, schema={n_specs})")
        if not args.dry_run:
            path.write_text(text, encoding="utf-8")

    print(f"\n{files} files, {bands} footer bands, {specs} schema specs"
          f"{' (dry run)' if args.dry_run else ''}")
    if no_anchor:
        print("footer without a map band (skipped): " + ", ".join(no_anchor))


if __name__ == "__main__":
    main()
