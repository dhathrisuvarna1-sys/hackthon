import re
import unicodedata
from typing import Dict, List, Tuple, Any

# Pattern for URLs including standard domains, IP addresses, and URL shorteners
URL_REGEX = re.compile(
    r'(https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|in|co|xyz|info|top|live|app|site|click|link|vip|me|cc|online|pw)(?:/[^\s]*)?)',
    re.IGNORECASE
)

# Pattern for Indian phone numbers (10 digits, optional +91, 0 prefix, spaces/dashes)
PHONE_REGEX = re.compile(
    r'(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b'
)

# Pattern for UPI Virtual Payment Addresses (VPAs) e.g. someone@oksbi, fraud@paytm
UPI_VPA_REGEX = re.compile(
    r'[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}'
)

def normalize_text(raw_text: str) -> str:
    """
    Applies Unicode NFKC normalization, removes invisible/zero-width characters,
    and regularizes internal spaces without truncating text.
    """
    if not raw_text:
        return ""
    # Unicode NFKC
    normalized = unicodedata.normalize("NFKC", raw_text)
    # Strip zero-width spaces, joiners, directional marks
    normalized = re.sub(r'[\u200B-\u200D\uFEFF\u200E\u200F]', '', normalized)
    return normalized

def detect_language(text: str) -> str:
    """
    Identifies if text contains Kannada, Devanagari (Hindi), English, or mixed.
    """
    has_kannada = bool(re.search(r'[\u0C80-\u0CFF]', text))
    has_devanagari = bool(re.search(r'[\u0900-\u097F]', text))
    has_latin = bool(re.search(r'[a-zA-Z]', text))

    if has_kannada and has_devanagari:
        return "mixed"
    if has_kannada and has_latin:
        return "kn"
    if has_devanagari and has_latin:
        return "hi"
    if has_kannada:
        return "kn"
    if has_devanagari:
        return "hi"
    return "en"

def extract_entities(text: str) -> Dict[str, List[Dict[str, Any]]]:
    """
    Extracts URLs, phone numbers, and UPI VPAs with their start/end indices.
    """
    entities = {
        "urls": [],
        "phones": [],
        "upi_vpas": []
    }

    for match in URL_REGEX.finditer(text):
        entities["urls"].append({
            "text": match.group(0),
            "start": match.start(),
            "end": match.end()
        })

    for match in PHONE_REGEX.finditer(text):
        entities["phones"].append({
            "text": match.group(0),
            "start": match.start(),
            "end": match.end()
        })

    for match in UPI_VPA_REGEX.finditer(text):
        entities["upi_vpas"].append({
            "text": match.group(0),
            "start": match.start(),
            "end": match.end()
        })

    return entities
