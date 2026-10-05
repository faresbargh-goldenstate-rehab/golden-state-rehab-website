#!/usr/bin/env python3
"""Ping IndexNow (Bing, Yandex, Naver, Seznam, Yep) with pages that changed.

IndexNow is a push protocol: instead of waiting for Bing to recrawl, we tell
it which URLs changed and it fetches them within minutes. One POST to
api.indexnow.org is shared with every participating engine.

Ownership is proven by the key file at the site root ({KEY}.txt, containing
the key). The key is public by design, so it lives here as a constant.

Run AFTER the push has deployed (Cloudflare Pages takes ~1 min), otherwise
the engines fetch the old page:

  python3 scripts/indexnow_submit.py                 # pages changed in the last commit
  python3 scripts/indexnow_submit.py --since abc123  # pages changed since a commit
  python3 scripts/indexnow_submit.py --all           # every URL in sitemap.xml
  python3 scripts/indexnow_submit.py /programs/php /blog/how-long-is-rehab
  ... add --dry-run to print the URL list without sending it.

Changed pages are only sent if they are in sitemap.xml (so noindex/utility
pages stay out). Deleted .html files are sent too: that is how a 410'd page
tells Bing to drop it.
"""

import argparse
import json
import subprocess
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOST = "www.goldenstate-rehab.com"
ORIGIN = f"https://{HOST}"
KEY = "9f692a782cc140d997f5769bbead7db0"
KEY_LOCATION = f"{ORIGIN}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"
SITEMAP = ROOT / "sitemap.xml"
MAX_URLS_PER_REQUEST = 10_000
TIMEOUT_SECONDS = 20
# Cloudflare 403s urllib's default "Python-urllib" agent, so name ourselves.
USER_AGENT = "GoldenStateRehab-IndexNow/1.0 (+https://www.goldenstate-rehab.com)"

# IndexNow response codes, per https://www.indexnow.org/documentation
STATUS_MEANINGS = {
    200: "OK, URLs submitted.",
    202: "Accepted. The key is still being validated; URLs are queued.",
    400: "Bad request: the payload was malformed.",
    403: "Forbidden: the key file is missing or does not match the key.",
    422: "Unprocessable: a URL is not on this host, or the key does not match.",
    429: "Too many requests: slow down and retry later.",
}


def file_to_url(rel_path: str) -> str | None:
    """Map a repo-relative .html path to its live URL (Pages drops .html)."""
    if not rel_path.endswith(".html") or rel_path == "404.html":
        return None
    stem = rel_path[: -len(".html")]
    if stem == "index":
        return f"{ORIGIN}/"
    if stem.endswith("/index"):
        return f"{ORIGIN}/{stem[: -len('index')]}"
    return f"{ORIGIN}/{stem}"


def sitemap_urls() -> list[str]:
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    tree = ET.parse(SITEMAP)
    return [loc.text.strip() for loc in tree.getroot().findall("sm:url/sm:loc", ns)]


def changed_files(since: str) -> list[tuple[str, str]]:
    """(status letter, path) for every file changed between `since` and HEAD."""
    result = subprocess.run(
        ["git", "diff", "--name-status", "--no-renames", since, "HEAD"],
        cwd=ROOT, capture_output=True, text=True,
    )
    if result.returncode != 0:
        sys.exit(f"git diff failed for '{since}': {result.stderr.strip()}")
    pairs = (line.split("\t", 1) for line in result.stdout.splitlines() if line)
    return [(status[0], path) for status, path in pairs]


def urls_from_changes(changes: list[tuple[str, str]], indexable: set[str]) -> list[str]:
    urls = []
    for status, path in changes:
        url = file_to_url(path)
        if url and (status == "D" or url in indexable):
            urls.append(url)
    return sorted(set(urls))


def normalize_arg(arg: str) -> str:
    """Accept full URLs, site paths (/programs/php) or repo files (programs/php.html)."""
    if arg.startswith(ORIGIN):
        return arg
    if arg.endswith(".html"):
        return file_to_url(arg.lstrip("/")) or sys.exit(f"Not a page: {arg}")
    return f"{ORIGIN}/{arg.lstrip('/')}"


def key_file_is_live() -> bool:
    try:
        request = urllib.request.Request(KEY_LOCATION, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as resp:
            return resp.read().decode().strip() == KEY
    except (urllib.error.URLError, TimeoutError) as err:
        print(f"Could not fetch {KEY_LOCATION}: {err}", file=sys.stderr)
        return False


def submit(urls: list[str]) -> int:
    """POST one batch; return the HTTP status code."""
    payload = {"host": HOST, "key": KEY, "keyLocation": KEY_LOCATION, "urlList": urls}
    request = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": USER_AGENT},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as resp:
            return resp.status
    except urllib.error.HTTPError as err:
        return err.code
    except (urllib.error.URLError, TimeoutError) as err:
        sys.exit(f"Could not reach {ENDPOINT}: {err}")


def pick_urls(args: argparse.Namespace) -> list[str]:
    if args.urls:
        return sorted({normalize_arg(u) for u in args.urls})
    if args.all:
        return sitemap_urls()
    return urls_from_changes(changed_files(args.since), set(sitemap_urls()))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("urls", nargs="*", help="URLs, paths or .html files to submit")
    parser.add_argument("--all", action="store_true", help="submit every sitemap URL")
    parser.add_argument("--since", default="HEAD~1", help="git ref to diff from (default HEAD~1)")
    parser.add_argument("--dry-run", action="store_true", help="print URLs, send nothing")
    args = parser.parse_args()

    urls = pick_urls(args)
    if not urls:
        print("No indexable pages changed. Nothing to submit.")
        return 0

    print(f"{len(urls)} URL(s):")
    print("\n".join(f"  {u}" for u in urls))
    if args.dry_run:
        print("Dry run: nothing sent.")
        return 0

    if not key_file_is_live():
        print(f"Key file not live at {KEY_LOCATION}. Push {KEY}.txt and wait for the deploy.",
              file=sys.stderr)
        return 1

    failed = False
    for start in range(0, len(urls), MAX_URLS_PER_REQUEST):
        code = submit(urls[start : start + MAX_URLS_PER_REQUEST])
        print(f"IndexNow {code}: {STATUS_MEANINGS.get(code, 'Unexpected response.')}")
        failed = failed or code not in (200, 202)
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
