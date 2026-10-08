import re
from typing import List, Dict, Any

IMPERSONATION_PATTERNS = [
    # English
    r"\b(?:electricity power will be disconnected|electricity bill unpaid|contact electricity officer|trai sim disconnection|police cyber cell notice|cbi officer|bank manager calling|rbi notice|customer care executive)\b",
    # Kannada
    r"(?:ವಿದ್ಯುತ್ ಸಂಪರ್ಕ ಕಡಿತಗೊಳಿಸಲಾಗುತ್ತದೆ|ವಿದ್ಯುತ್ ಬಿಲ್ ಪಾವತಿಸಿಲ್ಲ|ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ|ಸಿಮ್ ರದ್ದುಗೊಳ್ಳುತ್ತದೆ|ಬ್ಯಾಂಕ್ ಮ್ಯಾನೇಜರ್)",
    # Hindi
    r"(?:बिजली बिल का भुगतान नहीं हुआ|बिजली काट दी जाएगी|अधिकारी से संपर्क करें|सिम ब्लॉक कर दिया जाएगा|पुलिस नोटिस|बैंक अधिकारी)"
]

def check_impersonation(text: str) -> List[Dict[str, Any]]:
    matches = []
    text_lower = text.lower()
    for pattern in IMPERSONATION_PATTERNS:
        for m in re.finditer(pattern, text_lower if pattern.isascii() else text, re.IGNORECASE):
            matches.append({
                "code": "authority_impersonation",
                "category": "Authority Impersonation",
                "matched_text": text[m.start():m.end()],
                "start": m.start(),
                "end": m.end(),
                "weight": 0.75,
                "description": "Poses as a utility provider, police officer, or bank manager to extort action."
            })
    return matches
