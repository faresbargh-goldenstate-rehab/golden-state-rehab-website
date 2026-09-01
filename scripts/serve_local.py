#!/usr/bin/env python3
"""Local preview server that routes the way Cloudflare Pages does.

A plain `python3 -m http.server` gets this site wrong in one specific place:
`locations.html` and the `locations/` directory both claim the `/locations`
path. The stdlib server checks directories first, so `/locations` 301s to
`/locations/` and renders a directory listing instead of the page. Pages
resolves the same request to `locations.html`.

This server applies the Pages precedence — extensionless request -> `<path>.html`
first, directory index only after — so local preview matches production.

    python3 scripts/serve_local.py [--port 8080]

Then open http://127.0.0.1:8080/ and browse with the site's real URLs
(/locations, /locations/santa-monica, /es/, ...).
"""

import argparse
import functools
import http.server
import socketserver
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class PagesRequestHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler with Cloudflare Pages' file-before-directory rule."""

    def translate_path(self, path: str) -> str:
        local = Path(super().translate_path(path))

        # Only extensionless requests are ambiguous; real files pass straight through.
        if local.is_file():
            return str(local)

        html_sibling = local.with_suffix(".html")
        if html_sibling.is_file():
            return str(html_sibling)

        if local.is_dir():
            index = local / "index.html"
            if index.is_file():
                return str(index)

        return str(local)

    def send_head(self):
        # The base class 301s any directory request to add a trailing slash, which
        # would re-introduce the /locations -> /locations/ bounce before
        # translate_path ever runs.
        raw = self.path.split("?", 1)[0]
        local = Path(super().translate_path(raw))
        if local.is_dir() and local.with_suffix(".html").is_file():
            if not (local / "index.html").is_file():
                # Production 308s /locations/ back to /locations. Matching that
                # matters: served at the trailing slash, the page's relative
                # asset paths would resolve to /locations/css/... and 404.
                if raw.endswith("/"):
                    return self._redirect(raw.rstrip("/"))
                return self._send_file(local.with_suffix(".html"))
        return super().send_head()

    def _redirect(self, location: str):
        self.send_response(308)
        self.send_header("Location", location or "/")
        self.send_header("Content-Length", "0")
        self.end_headers()
        return None

    def _send_file(self, target: Path):
        try:
            body = target.read_bytes()
        except OSError:
            self.send_error(404, "File not found")
            return None
        self.send_response(200)
        self.send_header("Content-type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        # Local preview should never serve a stale stylesheet.
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        import io

        return io.BytesIO(body)

    def log_message(self, fmt, *args):  # quieter than the default one-line-per-asset
        if not args or "200" not in str(args):
            super().log_message(fmt, *args)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--port", type=int, default=8080)
    ap.add_argument("--bind", default="127.0.0.1")
    args = ap.parse_args()

    handler = functools.partial(PagesRequestHandler, directory=str(ROOT))
    # Threading matters: real browsers open several parallel connections, and
    # a plain TCPServer serves them one at a time — one slow request stalls
    # the whole page load.
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    socketserver.ThreadingTCPServer.daemon_threads = True
    with socketserver.ThreadingTCPServer((args.bind, args.port), handler) as httpd:
        print(f"serving {ROOT} at http://{args.bind}:{args.port}/  (ctrl-c to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")


if __name__ == "__main__":
    main()
