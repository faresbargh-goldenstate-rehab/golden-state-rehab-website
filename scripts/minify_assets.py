#!/usr/bin/env python3
"""FIX 4 — minify the JS that ships to browsers.

The repo already follows a "source alongside committed .min sibling" convention
(js/main.js -> js/main.min.js, css/styles.css -> css/styles.min.css). i18n.js,
contact.js and intake.js were the three that shipped raw. This script mirrors
them into .min.js siblings so the readable sources stay in version control.

All three sources are IIFE-wrapped and export no globals, so the minifier is
free to rename their internals.

Run after editing any of the sources, then bump the ?v= param in the HTML:
  python3 scripts/minify_assets.py
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# source -> committed minified sibling that the HTML actually references.
# main.js is deliberately absent: the committed main.min.js is not a byte-clean
# esbuild output of it, so regenerating here would ship an unreviewed diff to
# every page. Reconcile that pair separately before adding it.
TARGETS = {
    ROOT / "js/i18n.js": ROOT / "js/i18n.min.js",
    ROOT / "js/contact.js": ROOT / "js/contact.min.js",
    ROOT / "js/intake.js": ROOT / "js/intake.min.js",
}


def esbuild_cmd() -> list[str]:
    """Prefer a locally installed esbuild; fall back to npx."""
    local = shutil.which("esbuild")
    if local:
        return [local]
    npx = shutil.which("npx")
    if not npx:
        sys.exit("error: neither esbuild nor npx is on PATH — cannot minify")
    return [npx, "--yes", "esbuild"]


def minify(src: Path, dest: Path, base: list[str], dry_run: bool) -> None:
    result = subprocess.run(
        base + [str(src), "--minify"],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        sys.exit(f"error: esbuild failed on {src.name}\n{result.stderr}")

    output = result.stdout
    if not output.strip():
        sys.exit(f"error: esbuild produced empty output for {src.name}")

    before = src.stat().st_size
    after = len(output.encode("utf-8"))
    saved = 100 * (1 - after / before)
    print(f"{src.name:>14} -> {dest.name:<18} {before:>7,}B -> {after:>7,}B  (-{saved:.0f}%)")

    if not dry_run:
        dest.write_text(output, encoding="utf-8")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    base = esbuild_cmd()
    for src, dest in TARGETS.items():
        if not src.exists():
            sys.exit(f"error: missing source {src}")
        minify(src, dest, base, args.dry_run)

    if args.dry_run:
        print("\n(dry run — no files written)")


if __name__ == "__main__":
    main()
