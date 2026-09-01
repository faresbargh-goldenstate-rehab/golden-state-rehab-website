#!/usr/bin/env python3
"""Inject (or version-bump) the Golden Guide chat widget script tag sitewide.

Adds exactly one line before </body> on every public page:
    <script src="/js/chat.min.js?v=N" defer></script>

Root-absolute src on purpose — pages in this repo mix js/, ../js/ and /js/
prefixes, and root-absolute works from every directory (same choice i18n made).

Skips: docs/ (internal), amenity-map.html (internal utility), and any page
that already has the tag (idempotent — safe to re-run).

Usage:
  python3 scripts/add_chat_snippet.py --dry-run   # report only
  python3 scripts/add_chat_snippet.py             # inject v=1 where missing
  python3 scripts/add_chat_snippet.py --bump 2    # rewrite ?v= on all pages
                                                  # (run after editing chat.js
                                                  #  or chat.css + minifying)
"""

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SKIP_DIRS = {"docs", "node_modules", ".git"}
SKIP_FILES = {"amenity-map.html"}

TAG_RE = re.compile(r'<script src="/js/chat\.min\.js\?v=(\d+)" defer></script>')


def tag(version):
    return '<script src="/js/chat.min.js?v=%d" defer></script>' % version


def iter_pages():
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT)
        if rel.parts[0] in SKIP_DIRS or rel.name in SKIP_FILES:
            continue
        yield path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--bump", type=int, metavar="N",
                    help="rewrite existing tags to ?v=N instead of injecting")
    args = ap.parse_args()
    version = args.bump or 1

    changed, skipped, missing_body = [], [], []
    for path in iter_pages():
        rel = path.relative_to(ROOT).as_posix()
        html = path.read_text(encoding="utf-8")
        existing = TAG_RE.search(html)

        if args.bump:
            if not existing:
                skipped.append(rel)
                continue
            if int(existing.group(1)) == version:
                skipped.append(rel)
                continue
            new_html = TAG_RE.sub(tag(version), html)
        else:
            if existing:
                skipped.append(rel)
                continue
            if "</body>" not in html:
                missing_body.append(rel)
                continue
            # Insert on its own line right before the closing body tag.
            idx = html.rindex("</body>")
            new_html = html[:idx] + tag(version) + "\n" + html[idx:]

        changed.append(rel)
        if not args.dry_run:
            path.write_text(new_html, encoding="utf-8")

    verb = "bumped" if args.bump else "injected"
    print("%s: %d file(s); skipped (already current/absent): %d"
          % (verb, len(changed), len(skipped)))
    for rel in changed:
        print("  +", rel)
    if missing_body:
        print("WARNING: no </body> found in:")
        for rel in missing_body:
            print("  !", rel)
    if args.dry_run:
        print("(dry run — no files written)")


if __name__ == "__main__":
    main()
