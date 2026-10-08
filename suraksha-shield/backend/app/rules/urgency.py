import re
from typing import List, Dict, Any

URGENCY_PATTERNS = [
    # English
    r"\b(?:immediately|urgent|within 24 hours|account will be blocked|blocked today|suspended today|last warning|action required now|immediate effect|service terminated|deactivated tonight)\b",
    # Kannada
    r"(?:ತಕ್ಷಣವೇ|ಇಂದು ನಿರ್ಬಂಧಿಸಲಾಗುತ್ತದೆ|24 ಗಂಟೆಗಳ ಒಳಗೆ|ಕೊನೆಯ ಎಚ್ಚರಿಕೆ|ಖಾತೆ ರದ್ದುಗೊಳ್ಳುತ್ತದೆ|ತಕ್ಷಣ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ|ಇಂದೇ ಕೊನೆ ದಿನ)",
    # Hindi
    r"(?:तुरंत|आज ही ब्लॉक कर दिया जाएगा|24 घंटे के भीतर|अंतिम चेतावनी|खाता बंद कर दिया जाएगा|तत्काल प्रभाव से|सेवा समाप्त)",
    # Transliterated (Hinglish/Kanglish)
    r"\b(?:turant|aaj hi block|last warning|turanta)\b"
]

def check_urgency(text: str) -> List[Dict[str, Any]]:
    matches = []
    text_lower = text.lower()
    for pattern in URGENCY_PATTERNS:
        for m in re.finditer(pattern, text_lower if pattern.isascii() else text, re.IGNORECASE):
            matches.append({
                "code": "urgency",
                "category": "Artificial Urgency",
                "matched_text": text[m.start():m.end()],
                "start": m.start(),
                "end": m.end(),
                "weight": 0.65,
                "description": "Pressures victim with imminent account block or artificial deadline."
            })
    return matches
