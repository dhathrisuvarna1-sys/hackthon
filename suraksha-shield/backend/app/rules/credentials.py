import re
from typing import List, Dict, Any

CREDENTIAL_PATTERNS = [
    # English
    r"\b(?:share (?:your )?otp|enter (?:your )?upi pin|tell me (?:the )?otp|provide password|send cvv|card expiry and cvv|enter pin to receive|enter mpin|share verification code)\b",
    # Kannada
    r"(?:ಒಟಿಪಿ ಹಂಚಿಕೊಳ್ಳಿ|ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಿ|ಪಾಸ್‌ವರ್ಡ್ ನೀಡಿ|ಸಿವಿವಿ ಕಳುಹಿಸಿ|ಪರಿಶೀಲನಾ ಕೋಡ್ ನೀಡಿ)",
    # Hindi
    r"(?:ओटीपी साझा करें|ओटीपी बताएं|यूपीआई पिन दर्ज करें|पासवर्ड भेजें|सीवीवी दर्ज करें|वेरिफिकेशन कोड दें)",
    # Transliterated
    r"\b(?:otp bhejo|pin dalo|pin enter karo|otp batao|upi pin dalo)\b"
]

def check_credentials(text: str) -> List[Dict[str, Any]]:
    matches = []
    text_lower = text.lower()
    for pattern in CREDENTIAL_PATTERNS:
        for m in re.finditer(pattern, text_lower if pattern.isascii() else text, re.IGNORECASE):
            matches.append({
                "code": "credential_theft",
                "category": "Credential Theft",
                "matched_text": text[m.start():m.end()],
                "start": m.start(),
                "end": m.end(),
                "weight": 0.95,
                "description": "Attempts to solicit confidential authentication factors like OTP, UPI PIN, or passwords."
            })
    return matches
