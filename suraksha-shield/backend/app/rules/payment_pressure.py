import re
from typing import List, Dict, Any

PRESSURE_PATTERNS = [
    # English
    r"\b(?:pay immediately or face arrest|penalty charges applied|legal action initiated|court warrant issued|fir will be registered|pay within 10 minutes|account seized)\b",
    # Kannada
    r"(?:ತಕ್ಷಣ ಪಾವತಿಸಿ ಇಲ್ಲವೇ ದಂಡ|ಕಾನೂನು ಕ್ರಮ ಕೈಗೊಳ್ಳಲಾಗುತ್ತದೆ|ಖಾತೆ ಮುಟ್ಟುಗೋಲು|ಬಂಧನದ ವಾರಂಟ್)",
    # Hindi
    r"(?:तुरंत भुगतान करें अन्यथा गिरफ्तारी|कानूनी कार्रवाई शुरू|एफआईआर दर्ज की जाएगी|खाता कुर्क किया जाएगा|जुर्माना लगेगा)"
]

def check_payment_pressure(text: str) -> List[Dict[str, Any]]:
    matches = []
    text_lower = text.lower()
    for pattern in PRESSURE_PATTERNS:
        for m in re.finditer(pattern, text_lower if pattern.isascii() else text, re.IGNORECASE):
            matches.append({
                "code": "payment_pressure",
                "category": "Coercion & Intimidation",
                "matched_text": text[m.start():m.end()],
                "start": m.start(),
                "end": m.end(),
                "weight": 0.80,
                "description": "Uses intimidation, legal threats, or immediate penalties to compel payment."
            })
    return matches
