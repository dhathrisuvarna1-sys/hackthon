import re
from typing import List, Dict, Any

# Known suspicious shorteners or high-risk TLDs commonly used in phishing campaigns
SUSPICIOUS_SHORTENERS = [
    r"\b(?:bit\.ly|tinyurl\.com|is\.gd|rb\.gy|cutt\.ly|t\.co|shorturl\.at|wa\.me|v\.gd)\/[^\s]+",
    r"\b[a-zA-Z0-9.-]+\.(?:xyz|top|live|click|club|link|vip|pw|online|site|app|cc|work|loan|stream)\/[^\s]*",
    r"\b(?:sbi|hdfc|icici|axis|pnb|paytm|phonepe|gpay)[a-zA-Z0-9.-]*-(?:kyc|update|login|verify|support|help|secure)\.[a-zA-Z]{2,}(?:\/[^\s]*)?",
    r"\b[a-zA-Z0-9.-]+\.apk\b",
    r"\bhttps?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?::\d+)?(?:\/[^\s]*)?"
]

GENERIC_URL_PATTERN = r"(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)"

def check_links(text: str) -> List[Dict[str, Any]]:
    matches = []
    
    # 1. Check explicitly high-risk patterns / shorteners / APKs / IP links
    for pattern in SUSPICIOUS_SHORTENERS:
        for m in re.finditer(pattern, text, re.IGNORECASE):
            matches.append({
                "code": "suspicious_link",
                "category": "Suspicious Link",
                "matched_text": m.group(0),
                "start": m.start(),
                "end": m.end(),
                "weight": 0.85,
                "description": "Contains an unverified URL shortener, lookalike bank domain, or APK download."
            })

    # 2. If no high-risk pattern matched, check generic links with lower weight
    if not matches:
        for m in re.finditer(GENERIC_URL_PATTERN, text, re.IGNORECASE):
            matched_str = m.group(0)
            # Exclude legitimate official domains from flagging as suspicious
            if any(trusted in matched_str.lower() for trusted in ["cybercrime.gov.in", "npci.org.in", "rbi.org.in"]):
                continue
            matches.append({
                "code": "unverified_link",
                "category": "Unverified Link",
                "matched_text": matched_str,
                "start": m.start(),
                "end": m.end(),
                "weight": 0.45,
                "description": "Message directs to an external unverified web address."
            })

    return matches
