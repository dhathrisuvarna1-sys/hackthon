import re
from typing import List, Dict, Any

KYC_PATTERNS = [
    # English
    r"\b(?:kyc verification|complete kyc|update your pan|aadhaar link|kyc suspended|pan card blocked|update kyc immediately|bank account inactive|unfreeze account)\b",
    # Kannada
    r"(?:ಕೆವೈಸಿ ಪರಿಶೀಲನೆ|ಕೆವೈಸಿ ನವೀಕರಿಸಿ|ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಲಿಂಕ್|ಖಾತೆ ಅಮಾನತು|ಆಧಾರ್ ಲಿಂಕ್ ಮಾಡಿ)",
    # Hindi
    r"(?:केवाईसी सत्यापन|केवाईसी अपडेट|पैन कार्ड लिंक|खाता निलंबित|आधार कार्ड लिंक करें|पैन ब्लॉक)"
]

def check_kyc(text: str) -> List[Dict[str, Any]]:
    matches = []
    text_lower = text.lower()
    for pattern in KYC_PATTERNS:
        for m in re.finditer(pattern, text_lower if pattern.isascii() else text, re.IGNORECASE):
            matches.append({
                "code": "kyc_impersonation",
                "category": "Fake KYC Trap",
                "matched_text": text[m.start():m.end()],
                "start": m.start(),
                "end": m.end(),
                "weight": 0.70,
                "description": "Demands immediate KYC / PAN / Aadhaar updates via unofficial channels."
            })
    return matches
