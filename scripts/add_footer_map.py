#!/usr/bin/env python3
"""Add the Google Business Profile map band to every footer.

Inserts a `.footer-visit` band (address, profile links, embedded map) directly
before `<div class="footer-bottom">`, so it sits between the link columns and
the copyright bar. English and Spanish copies are chosen from `<html lang>`.

Why this embed and not the Locator Plus / Maps Embed API snippets:
  * The map is Google's keyless "Share → Embed a map" iframe, keyed on the
    listing's ftid (`0x80c2bbc5e47e9077:0xd15fb9f046f6ae67`, which decodes to
    CID 15086981718348312167 — the same Business Profile the footer address
    link already points at). It therefore renders the Business Profile card,
    and its "View larger map" opens the listing rather than a street address.
  * It needs no API key, has no quota, and `loading="lazy"` keeps it at zero
    bytes until the footer scrolls into view. Locator Plus would load ~800 KB
    of Maps JS on every page and, as generated, links nowhere.

Idempotent: pages that already contain the `footer-visit` marker are skipped.
The band's styles live in css/styles.css (`.footer-visit*`) — remember the
min mirror and the `?v=` bump when they change.

Usage:
  python3 scripts/add_footer_map.py --dry-run
  python3 scripts/add_footer_map.py
"""

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Internal docs are served but never get the site chrome; probe-faq.html is an
# untracked scratch copy that matches sitewide greps but must not ship.
EXCLUDE_DIRS = {"docs"}
EXCLUDE_FILES = {"probe-faq.html"}

MARKER = "footer-visit"
ANCHOR = '<div class="footer-bottom">'

PLACE_ID = "ChIJd5B-5MW7woARZ672RvC5X9E"
CID = "15086981718348312167"
FTID = "0x80c2bbc5e47e9077:0xd15fb9f046f6ae67"
LAT, LNG = "34.0474328", "-118.4343784"
PROFILE_URL = f"https://www.google.com/maps?cid={CID}"
DIRECTIONS_URL = (
    "https://www.google.com/maps/dir/?api=1"
    "&amp;destination=1964+Westwood+Blvd+Ste+425+Los+Angeles+CA+90025"
    f"&amp;destination_place_id={PLACE_ID}"
)

COPY = {
    "en": {
        "eyebrow": "Visit Us",
        "note": (
            "Our outpatient center in Westwood, West Los Angeles &mdash; minutes "
            "from Santa Monica, Beverly Hills, Brentwood, and Culver City."
        ),
        "open": "Open in Google Maps",
        "directions": "Get directions",
        "title": "Google Map: Golden State Rehab, 1964 Westwood Blvd Suite 425, Los Angeles",
        "hl": "en",
    },
    "es": {
        "eyebrow": "Visítanos",
        "note": (
            "Nuestro centro ambulatorio en Westwood, al oeste de Los Ángeles &mdash; "
            "a minutos de Santa Mónica, Beverly Hills, Brentwood y Culver City."
        ),
        "open": "Abrir en Google Maps",
        "directions": "Cómo llegar",
        "title": "Mapa de Google: Golden State Rehab, 1964 Westwood Blvd Suite 425, Los Ángeles",
        "hl": "es",
    },
}


def embed_src(hl: str) -> str:
    """Google's place-embed URL. `1d` is the map scale (~zoom 15 at this
    latitude); `1s` is the ftid that binds the pin to the Business Profile."""
    ftid = FTID.replace(":", "%3A")
    return (
        "https://www.google.com/maps/embed?pb="
        f"!1m18!1m12!1m3!1d3305.3!2d{LNG}!3d{LAT}"
        "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1"
        f"!3m3!1m2!1s{ftid}!2sGolden%20State%20Rehab!5e0"
        f"!3m2!1s{hl}!2sus!4v1758000000000!5m2!1s{hl}!2sus"
    )


def render_band(lang: str) -> str:
    c = COPY[lang]
    return (
        '<div class="footer-visit">'
        '<div class="footer-visit-text">'
        f'<div class="footer-visit-eyebrow">{c["eyebrow"]}</div>'
        '<p class="footer-visit-addr">1964 Westwood Blvd, Suite 425<br>Los Angeles, CA 90025</p>'
        f'<p class="footer-visit-note">{c["note"]}</p>'
        '<div class="footer-visit-links">'
        f'<a href="{PROFILE_URL}" target="_blank" rel="noopener">'
        f'<i data-lucide="external-link"></i> {c["open"]}</a>'
        f'<a href="{DIRECTIONS_URL}" target="_blank" rel="noopener">'
        f'<i data-lucide="navigation"></i> {c["directions"]}</a>'
        "</div></div>"
        '<div class="footer-visit-map">'
        f'<iframe src="{embed_src(c["hl"])}" title="{c["title"]}" width="600" height="240" '
        'loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>'
        "</div></div>"
    )


def page_lang(text: str) -> str:
    m = re.search(r'<html[^>]*\blang="([a-z]{2})', text)
    return "es" if m and m.group(1) == "es" else "en"


# Optional leading newline + indent so pretty-printed footers stay pretty.
ANCHOR_RE = re.compile(r"(\n[ \t]*)?" + re.escape(ANCHOR))


def add_band(text: str) -> tuple[str, int]:
    band = render_band(page_lang(text))
    count = 0

    def repl(m: re.Match) -> str:
        nonlocal count
        count += 1
        lead = m.group(1) or ""
        return lead + band + lead + ANCHOR

    return ANCHOR_RE.sub(repl, text, count=1), count


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    updated = skipped = no_anchor = 0
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] in EXCLUDE_DIRS or path.name in EXCLUDE_FILES:
            continue
        original = path.read_text(encoding="utf-8")
        if "<footer" not in original:
            continue
        if MARKER in original:
            skipped += 1
            continue
        text, n = add_band(original)
        if not n:
            no_anchor += 1
            print(f"no footer-bottom anchor, left alone: {rel}")
            continue
        updated += 1
        print(f"{'would update' if args.dry_run else 'updated'} {rel} [{page_lang(original)}]")
        if not args.dry_run:
            path.write_text(text, encoding="utf-8")

    print(f"\nfooter map band: {updated} file(s)")
    if skipped:
        print(f"already had the band, skipped: {skipped} file(s)")
    if no_anchor:
        print(f"no anchor: {no_anchor} file(s)")


if __name__ == "__main__":
    main()
