import re
from typing import List, Dict, Any

REFUND_PATTERNS = [
    # English
    r"\b(?:approve to receive|approve collect request to get refund|scan qr code to receive money|enter upi pin to credit|cashback credit pending|receive your refund of|double your payment)\b",
    # Kannada
    r"(?:ಹಣ ಮರಳಿ ಪಡೆಯಲು ಸ್ವೀಕರಿಸಿ|ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ಪಡೆಯಲು ಪಿನ್ ನಮೂದಿಸಿ|ರಿಫಂಡ್ ಪಡೆಯಲು ಕಲೆಕ್ಟ್ ವಿನಂತಿ ಅನುಮೋದಿಸಿ|ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಹಣ ಪಡೆಯಿರಿ)",
    # Hindi
    r"(?:रिफंड पाने के लिए अप्रूव करें|कैशबैक पाने के लिए पिन डालें|पैसे प्राप्त करने के लिए क्यूआर कोड स्कैन करें|कलेक्ट रिक्वेस्ट स्वीकार करें|रिफंड पेंडिंग)"
]

def check_refund(text: str) -> List[Dict[str, Any]]:
    matches = []
    text_lower = text.lower()
    for pattern in REFUND_PATTERNS:
        for m in re.finditer(pattern, text_lower if pattern.isascii() else text, re.IGNORECASE):
            matches.append({
                "code": "refund_scam",
                "category": "Refund & Reversal Scam",
                "matched_text": text[m.start():m.end()],
                "start": m.start(),
                "end": m.end(),
                "weight": 0.85,
                "description": "Falsely claims victim must approve a transaction or enter PIN to receive money."
            })
    return matches
