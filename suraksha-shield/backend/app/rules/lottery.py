import re
from typing import List, Dict, Any

LOTTERY_PATTERNS = [
    # English
    r"\b(?:won a lottery|congratulations you won|kbc lucky draw|cash prize of rs|claim your prize|selected for reward|reward points expire|unclaimed jackpot|winner of ₹|free gift card)\b",
    # Kannada
    r"(?:ನೀವು ಲಾಟರಿ ಗೆದ್ದಿದ್ದೀರಿ|ಅಭಿನಂದನೆಗಳು ನೀವು ಬಹುಮಾನ ಗೆದ್ದಿದ್ದೀರಿ|ಕೆಬಿಸಿ ಲಕ್ಕಿ ಡ್ರಾ|ಬಹುಮಾನ ಪಡೆಯಿರಿ|ಲಕ್ಷ ರೂಪಾಯಿ ಬಹುಮಾನ)",
    # Hindi
    r"(?:लॉटरी जीत चुके हैं|बधाई हो आपने जीता|केबीसी लकी ड्रॉ|इनाम का दावा करें|रिवॉर्ड पॉइंट्स|लाख रुपये का पुरस्कार|विजेता चुने गए हैं)"
]

def check_lottery(text: str) -> List[Dict[str, Any]]:
    matches = []
    text_lower = text.lower()
    for pattern in LOTTERY_PATTERNS:
        for m in re.finditer(pattern, text_lower if pattern.isascii() else text, re.IGNORECASE):
            matches.append({
                "code": "lottery_fraud",
                "category": "Lottery & Prize Lure",
                "matched_text": text[m.start():m.end()],
                "start": m.start(),
                "end": m.end(),
                "weight": 0.80,
                "description": "Lures recipient with fabricated lotteries, KBC prizes, or cash rewards."
            })
    return matches
