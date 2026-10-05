#!/usr/bin/env python3
"""Unit tests for indexnow_submit.py. Run: python3 scripts/test_indexnow_submit.py"""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import indexnow_submit as ix  # noqa: E402

O = ix.ORIGIN


class FileToUrl(unittest.TestCase):
    def test_root_index(self):
        self.assertEqual(ix.file_to_url("index.html"), f"{O}/")

    def test_section_index_keeps_trailing_slash(self):
        self.assertEqual(ix.file_to_url("programs/index.html"), f"{O}/programs/")

    def test_page_drops_extension(self):
        self.assertEqual(ix.file_to_url("blog/how-long-is-rehab.html"), f"{O}/blog/how-long-is-rehab")

    def test_non_pages_are_skipped(self):
        for path in ("css/styles.css", "404.html", "sitemap.xml", "images/a.webp"):
            self.assertIsNone(ix.file_to_url(path), path)


class UrlsFromChanges(unittest.TestCase):
    INDEXABLE = {f"{O}/programs/php", f"{O}/"}

    def test_only_sitemap_pages_are_sent(self):
        changes = [("M", "programs/php.html"), ("M", "intake-success.html"), ("M", "css/styles.css")]
        self.assertEqual(ix.urls_from_changes(changes, self.INDEXABLE), [f"{O}/programs/php"])

    def test_deleted_pages_are_sent_for_removal(self):
        changes = [("D", "es/old-page.html")]
        self.assertEqual(ix.urls_from_changes(changes, self.INDEXABLE), [f"{O}/es/old-page"])

    def test_duplicates_collapse(self):
        changes = [("M", "index.html"), ("A", "index.html")]
        self.assertEqual(ix.urls_from_changes(changes, self.INDEXABLE), [f"{O}/"])


class NormalizeArg(unittest.TestCase):
    def test_forms(self):
        self.assertEqual(ix.normalize_arg("/programs/php"), f"{O}/programs/php")
        self.assertEqual(ix.normalize_arg("programs/php.html"), f"{O}/programs/php")
        self.assertEqual(ix.normalize_arg(f"{O}/faq"), f"{O}/faq")


class Sitemap(unittest.TestCase):
    def test_sitemap_is_on_our_host(self):
        urls = ix.sitemap_urls()
        self.assertTrue(urls)
        self.assertTrue(all(u.startswith(O) for u in urls))


class KeyFile(unittest.TestCase):
    def test_key_file_matches_constant(self):
        key_file = ix.ROOT / f"{ix.KEY}.txt"
        self.assertEqual(key_file.read_text().strip(), ix.KEY)


if __name__ == "__main__":
    unittest.main()
