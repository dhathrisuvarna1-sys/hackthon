import re
from typing import List, Dict, Any

REMOTE_TOOLS = [
    r"\b(?:anydesk|teamviewer|rustdesk|quicksupport|airdroid|screenshare|screen share|install remote app|download support apk)\b",
    r"(?:ಎನಿಡೆಸ್ಕ್|ಟೀಮ್‌ವೀವರ್|ಸ್ಕ್ರೀನ್‌ಶೇರ್|ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ)",
    r"(?:एनीडेस्क|टीमव्यूअर|स्क्रीन शेयर|रिमोट ऐप डाउनलोड करें)"
]

def check_remote_access(text: str) -> List[Dict[str, Any]]:
    matches = []
    text_lower = text.lower()
    for pattern in REMOTE_TOOLS:
        for m in re.finditer(pattern, text_lower if pattern.isascii() else text, re.IGNORECASE):
            matches.append({
                "code": "remote_access_fraud",
                "category": "Remote Access Tool",
                "matched_text": text[m.start():m.end()],
                "start": m.start(),
                "end": m.end(),
                "weight": 0.90,
                "description": "Instructs recipient to install screen-sharing software giving full device control to attacker."
            })
    return matches
