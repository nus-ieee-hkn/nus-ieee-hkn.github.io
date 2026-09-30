#!/usr/bin/env python3
"""
Scrape NUS ECE news pages and concatenate results into cde_ref.html.

The script fetches:
  https://cde.nus.edu.sg/ece/highlights/news/
  https://cde.nus.edu.sg/ece/highlights/news/?paged=2
  https://cde.nus.edu.sg/ece/highlights/news/?paged=3
  ...

It stops when the response suggests there are no more records, then writes all
retrieved page HTML into a single valid HTML file.
"""

import argparse
import re
import sys
import time
from pathlib import Path
from typing import List, Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://cde.nus.edu.sg/ece/highlights/news/"
DEFAULT_OUTPUT = "cde_ref.html"
DEFAULT_TIMEOUT = 20
DEFAULT_DELAY = 0.6
DEFAULT_MAX_PAGES = 200


def build_page_url(page_number: int) -> str:
    if page_number <= 1:
        return BASE_URL
    return f"{BASE_URL}?{urlencode({'paged': page_number})}"


def fetch_html(url: str, timeout: int, retries: int = 3) -> str:
    last_error = None  # type: Optional[Exception]
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        )
    }

    for attempt in range(1, retries + 1):
        try:
            req = Request(url, headers=headers)
            with urlopen(req, timeout=timeout) as response:
                return response.read().decode("utf-8", errors="replace")
        except (HTTPError, URLError, TimeoutError) as exc:
            last_error = exc
            if attempt < retries:
                sleep_s = 1.5 * attempt
                print(f"[warn] Fetch failed (attempt {attempt}/{retries}) for {url}: {exc}")
                print(f"[warn] Retrying in {sleep_s:.1f}s...")
                time.sleep(sleep_s)

    raise RuntimeError(f"Failed to fetch {url} after {retries} attempts: {last_error}")


def looks_like_incapsula_block(html: str) -> bool:
    lower_html = html.lower()
    markers = [
        "_incapsula_resource",
        "request unsuccessful. incapsula incident id",
        "swudnsai=",
    ]
    return any(marker in lower_html for marker in markers)


def build_candidate_urls(page_url: str) -> List[Tuple[str, str]]:
    encoded = quote(page_url, safe="")
    return [
        ("direct", page_url),
        ("allorigins", "https://api.allorigins.win/raw?url=" + encoded),
        ("corsproxy", "https://corsproxy.io/?" + encoded),
        ("codetabs", "https://api.codetabs.com/v1/proxy?quest=" + encoded),
    ]


def fetch_page_with_fallback(page_url: str, timeout: int) -> str:
    last_error_message = ""
    for source_name, candidate_url in build_candidate_urls(page_url):
        try:
            html = fetch_html(candidate_url, timeout=timeout)
        except Exception as exc:
            last_error_message = "source {} failed: {}".format(source_name, exc)
            print("[warn] {}".format(last_error_message))
            continue

        if looks_like_incapsula_block(html):
            print("[warn] Source {} returned Incapsula block page.".format(source_name))
            last_error_message = "source {} blocked by Incapsula".format(source_name)
            continue

        if has_no_records(html) or has_news_items(html):
            if source_name != "direct":
                print("[info] Using fallback source: {}".format(source_name))
            return html

        snippet = strip_tags(html[:240]).strip()
        print(
            "[warn] Source {} returned unexpected content. Snippet: {}".format(
                source_name, snippet
            )
        )
        last_error_message = "source {} returned unexpected content".format(source_name)

    raise RuntimeError(
        "Unable to fetch usable HTML for {}. Last issue: {}".format(
            page_url, last_error_message or "unknown"
        )
    )


def has_no_records(html: str) -> bool:
    lower_html = html.lower()
    no_record_markers = [
        "no record",
        "no records",
        "no posts found",
        "nothing found",
        "no results found",
    ]
    return any(marker in lower_html for marker in no_record_markers)


def has_news_items(html: str) -> bool:
    lower_html = html.lower()
    return (
        'class="ws-news-content"' in lower_html
        or "ws-news-content" in lower_html
        or "ws-news-list" in lower_html
    )


def strip_tags(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_title(news_block_html: str) -> str:
    title_match = re.search(
        r'<div[^>]*class=["\'][^"\']*\bcontent-title\b[^"\']*["\'][^>]*>.*?<h3[^>]*>(.*?)</h3>',
        news_block_html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not title_match:
        return ""
    return strip_tags(title_match.group(1)).lower()


def extract_news_blocks(page_html: str) -> List[str]:
    start_tag_pattern = re.compile(
        r'<div[^>]*class=["\'][^"\']*\bws-news-content\b[^"\']*["\'][^>]*>',
        flags=re.IGNORECASE,
    )
    div_tag_pattern = re.compile(r"<\s*(/?)\s*div\b[^>]*>", flags=re.IGNORECASE)
    blocks = []  # type: List[str]

    for start_match in start_tag_pattern.finditer(page_html):
        start_idx = start_match.start()
        depth = 0
        end_idx = -1

        for div_match in div_tag_pattern.finditer(page_html, pos=start_idx):
            is_closing = div_match.group(1) == "/"
            if not is_closing:
                depth += 1
            else:
                depth -= 1

            if depth == 0:
                end_idx = div_match.end()
                break

        if end_idx > start_idx:
            blocks.append(page_html[start_idx:end_idx])

    return blocks


def build_combined_html(pages: List[Tuple[int, str]]) -> str:
    parts = []  # type: List[str]
    parts.append("<!doctype html>")
    parts.append("<html lang=\"en\">")
    parts.append("<head>")
    parts.append("  <meta charset=\"utf-8\">")
    parts.append("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">")
    parts.append("  <title>CDE ECE News Reference (Concatenated)</title>")
    parts.append("</head>")
    parts.append("<body>")
    parts.append("  <!-- Auto-generated by scripts/scrape_cde_news_pages.py -->")

    for page_number, html in pages:
        parts.append(f"  <!-- START FULL PAGE {page_number} -->")
        parts.append(html)
        parts.append(f"  <!-- END FULL PAGE {page_number} -->")

    parts.append("</body>")
    parts.append("</html>")
    return "\n".join(parts) + "\n"


def scrape_all_pages(timeout: int, delay: float, max_pages: int) -> List[Tuple[int, str]]:
    all_pages = []  # type: List[Tuple[int, str]]

    for page_number in range(1, max_pages + 1):
        page_url = build_page_url(page_number)
        print(f"[info] Fetching page {page_number}: {page_url}")
        html = fetch_page_with_fallback(page_url, timeout=timeout)

        if has_no_records(html):
            print(f"[info] Stop condition met at page {page_number}: site reports no records.")
            break

        if not has_news_items(html):
            print(f"[info] Stop condition met at page {page_number}: no news markers detected.")
            break

        all_pages.append((page_number, html))
        print(f"[info] Saved full HTML for page {page_number} ({len(html)} chars)")
        time.sleep(delay)

    return all_pages


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scrape paginated NUS ECE news pages into one local HTML reference file."
    )
    parser.add_argument(
        "-o",
        "--output",
        default=DEFAULT_OUTPUT,
        help=f"Output file path (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=DEFAULT_TIMEOUT,
        help=f"HTTP timeout in seconds (default: {DEFAULT_TIMEOUT})",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=DEFAULT_DELAY,
        help=f"Delay between page requests in seconds (default: {DEFAULT_DELAY})",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=DEFAULT_MAX_PAGES,
        help=f"Safety cap on pages to fetch (default: {DEFAULT_MAX_PAGES})",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_path = Path(args.output)

    try:
        pages = scrape_all_pages(timeout=args.timeout, delay=args.delay, max_pages=args.max_pages)
    except Exception as exc:
        print(f"[error] Scrape failed: {exc}")
        return 1

    if not pages:
        print("[error] No pages were collected. Output file not written.")
        return 1

    combined_html = build_combined_html(pages)
    output_path.write_text(combined_html, encoding="utf-8")
    print(f"[ok] Wrote {len(pages)} full page(s) to {output_path.resolve()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
