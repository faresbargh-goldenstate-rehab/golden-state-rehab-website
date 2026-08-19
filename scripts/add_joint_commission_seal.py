#!/usr/bin/env python3
"""Add The Joint Commission Gold Seal of Approval sitewide.

Two independent, idempotent passes:

1. FOOTER SEAL — inserts the linked Gold Seal immediately after the existing
   `.footer-badges` block, inside `.footer-brand`, so the credentials group
   together. Handles all three badge-row variants (English 3-badge, Spanish
   3-badge, index.html's 2-badge outlier) and both the pretty-printed and
   minified footer shapes.

2. SCHEMA — appends a Joint Commission accreditation entry to the
   ORGANISATION-level `hasCredential` array in the JSON-LD.

   Important: several team/author pages carry `hasCredential` arrays describing
   an individual clinician (MD, LMFT, RADT, AMFT). Those must never receive an
   organisational accreditation, so this pass only touches arrays that contain
   the "DHCS Licensed" entry — the organisation's own credential list.

Joint Commission brand rules govern the markup: the seal links back to
jointcommission.org, keeps its square proportions via equal width/height, and
carries no added words or graphic elements.

Usage:
  python3 scripts/add_joint_commission_seal.py --dry-run
  python3 scripts/add_joint_commission_seal.py
"""

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Untracked scratch copy of faq.html; matches sitewide greps but must not ship.
EXCLUDE = {"probe-faq.html"}

SEAL_SRC = "/images/joint-commission-gold-seal.webp"
SEAL_ALT = "The Joint Commission logo that links to the Joint Commission homepage"
JC_URL = "https://www.jointcommission.org/"

# Marker used for the idempotency check — present in every instance we write.
MARKER = "joint-commission-gold-seal"

FOOTER_SEAL = (
    f'<a rel="noopener noreferrer" href="{JC_URL}" target="_blank" class="footer-seal">'
    f'<img src="{SEAL_SRC}" alt="{SEAL_ALT}" width="88" height="88" '
    f'loading="lazy" decoding="async"></a>'
)

# The badge row holds only <a> and <span> children — no nested <div> — so the
# first </div> after it is reliably the row's own closing tag.
BADGES_RE = re.compile(r'<div class="footer-badges">.*?</div>', re.DOTALL)

CREDENTIAL_FIELDS = [
    ('"@type"', '"EducationalOccupationalCredential"'),
    ('"name"', '"Joint Commission Accredited"'),
    ('"credentialCategory"', '"accreditation"'),
    ('"url"', f'"{JC_URL}"'),
]
RECOGNIZED_BY = {
    '"@type"': '"Organization"',
    '"name"': '"The Joint Commission"',
    '"url"': f'"{JC_URL}"',
}


def render_credential(separator: str) -> str:
    """Build the credential entry formatted to match the file it lands in.

    `separator` is the exact text sitting between the two existing entries, so
    reusing it keeps pretty-printed files pretty and inline files inline.
    """
    if "\n" not in separator:
        fields = ", ".join(f"{k}: {v}" for k, v in CREDENTIAL_FIELDS)
        recog = ", ".join(f"{k}: {v}" for k, v in RECOGNIZED_BY.items())
        return separator + "{ " + fields + ', "recognizedBy": { ' + recog + " } }"

    indent = separator.split("\n")[-1]          # indentation of an entry's "{"
    field = indent + "  "                        # indentation of its fields
    inner = field + "  "                         # indentation of recognizedBy's fields
    lines = [f"{field}{k}: {v}," for k, v in CREDENTIAL_FIELDS]
    lines.append(f'{field}"recognizedBy": {{')
    recog_items = list(RECOGNIZED_BY.items())
    for n, (k, v) in enumerate(recog_items):
        comma = "," if n < len(recog_items) - 1 else ""
        lines.append(f"{inner}{k}: {v}{comma}")
    lines.append(field + "}")
    return separator + "{\n" + "\n".join(lines) + "\n" + indent + "}"


def add_footer_seal(text: str) -> tuple[str, int]:
    """Insert the seal after the .footer-badges block. Returns (text, count)."""
    count = 0

    def repl(m: re.Match) -> str:
        nonlocal count
        count += 1
        return m.group(0) + FOOTER_SEAL

    return BADGES_RE.sub(repl, text), count


def find_arrays(text: str, key: str) -> list[tuple[int, int]]:
    """Return (start, end) offsets of each `key` array body, bracket-matched."""
    spans = []
    for m in re.finditer(rf'"{key}"\s*:\s*\[', text):
        i = m.end()
        depth, j = 1, i
        while j < len(text) and depth:
            if text[j] == "[":
                depth += 1
            elif text[j] == "]":
                depth -= 1
            j += 1
        if depth == 0:
            spans.append((i, j - 1))
    return spans


def add_schema(text: str) -> tuple[str, int]:
    """Append the JC credential to organisation-level hasCredential arrays."""
    count = 0
    # Rewrite back-to-front so earlier offsets stay valid.
    for start, end in reversed(find_arrays(text, "hasCredential")):
        body = text[start:end]
        # Organisation arrays are identified by the DHCS licence entry. Person
        # arrays (MD, LMFT, RADT, AMFT) lack it and are correctly skipped.
        if '"DHCS Licensed"' not in body:
            continue
        if "Joint Commission" in body:
            continue
        sep_match = re.search(r"\}(\s*,\s*)\{", body)
        if not sep_match:
            continue
        insert_at = start + body.rindex("}") + 1
        text = text[:insert_at] + render_credential(sep_match.group(1)) + text[insert_at:]
        count += 1
    return text, count


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    footer_files = schema_files = skipped = 0
    for path in sorted(ROOT.rglob("*.html")):
        if path.name in EXCLUDE:
            continue
        original = path.read_text(encoding="utf-8")

        text, n_footer = (original, 0) if MARKER in original else add_footer_seal(original)
        if MARKER in original:
            skipped += 1
        text, n_schema = add_schema(text)

        if text == original:
            continue
        rel = path.relative_to(ROOT)
        bits = []
        if n_footer:
            bits.append(f"{n_footer} seal")
        if n_schema:
            bits.append(f"{n_schema} credential")
        print(f"{'would update' if args.dry_run else 'updated'} {rel}: {', '.join(bits)}")
        if n_footer:
            footer_files += 1
        if n_schema:
            schema_files += 1
        if not args.dry_run:
            path.write_text(text, encoding="utf-8")

    print(f"\nfooter seal: {footer_files} file(s)")
    print(f"schema:      {schema_files} file(s)")
    if skipped:
        print(f"already had the seal, footer pass skipped: {skipped} file(s)")


if __name__ == "__main__":
    main()
