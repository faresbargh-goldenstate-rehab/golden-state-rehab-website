#!/usr/bin/env python3
"""Sitewide nav/footer link insertions (idempotent).

Rules:
  1. EN nav + footer: add "Outpatient Rehab" (programs/outpatient-rehab)
     immediately after the Intensive Outpatient anchor, reusing its href prefix.
  2. EN footer Addiction column: add "Fentanyl Addiction" after "Opioid Addiction",
     reusing its href style (bare / relative / absolute).
  3. ES-style footers (incl. espanol.html): append Opioides + Fentanilo after the
     Alcohol anchor in the Tratamientos column.

Usage:
  python3 scripts/apply_sitewide_links.py --dry-run
  python3 scripts/apply_sitewide_links.py
"""

import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXCLUDED_DIRS = {"docs", "scripts", "node_modules", ".git", "functions"}

IOP_RE = re.compile(
    r'<a href="(?P<p>[^"]*)programs/iop">Intensive Outpatient(?P<iop> \(IOP\))?</a>'
    r'(?!\s*<a href="[^"]*programs/outpatient-rehab")'
)
OPIOID_RE = re.compile(
    r'<a href="(?P<h>[^"]*)opioid">Opioid Addiction</a>'
    r'(?!\s*<a href="[^"]*fentanyl")'
)
ES_ALCOHOL_RE = re.compile(
    r'<a href="/es/treatments/alcohol">Alcohol</a>'
    r'(?!\s*<a href="/es/treatments/opioid")'
)


def indent_for(text: str, start: int) -> str:
    """If the match starts a line (only whitespace before it), return newline+indent."""
    line_start = text.rfind("\n", 0, start) + 1
    prefix = text[line_start:start]
    if prefix.strip() == "":
        return "\n" + prefix
    return ""


def apply_rules(text: str, is_es_style_target: bool):
    changes = []

    def sub_iop(m):
        sep = indent_for(text, m.start())
        changes.append("outpatient-rehab" + (" (nav)" if m.group("iop") else " (footer)"))
        return (
            m.group(0)
            + sep
            + f'<a href="{m.group("p")}programs/outpatient-rehab">Outpatient Rehab</a>'
        )

    def sub_opioid(m):
        sep = indent_for(text, m.start())
        href = m.group("h") + "fentanyl"
        changes.append("fentanyl (footer)")
        return m.group(0) + sep + f'<a href="{href}">Fentanyl Addiction</a>'

    def sub_es(m):
        sep = indent_for(text, m.start())
        changes.append("es-opioides+fentanilo (footer)")
        return (
            m.group(0)
            + sep
            + '<a href="/es/treatments/opioid">Opioides</a>'
            + sep
            + '<a href="/es/treatments/fentanyl">Fentanilo</a>'
        )

    if not is_es_style_target:
        text = IOP_RE.sub(sub_iop, text)
        text = OPIOID_RE.sub(sub_opioid, text)
    text = ES_ALCOHOL_RE.sub(sub_es, text)
    return text, changes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    totals = {}
    unmatched_en = []
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] in EXCLUDED_DIRS:
            continue
        is_es = rel.parts[0] == "es"
        original = path.read_text(encoding="utf-8")
        updated, changes = apply_rules(original, is_es_style_target=is_es)
        if changes:
            for c in changes:
                totals[c] = totals.get(c, 0) + 1
            print(f"{rel}: {', '.join(changes)}")
            if not args.dry_run:
                path.write_text(updated, encoding="utf-8")
        elif not is_es and "<nav" in original:
            if "programs/outpatient-rehab" not in original:
                unmatched_en.append(str(rel))

    print("\nSummary:")
    for k in sorted(totals):
        print(f"  {k}: {totals[k]}")
    if unmatched_en:
        print("\nEN files with a nav but NO insertion and NO existing outpatient-rehab link:")
        for f in unmatched_en:
            print(f"  CHECK  {f}")
    if args.dry_run:
        print("\n(dry run — no files written)")


if __name__ == "__main__":
    main()
