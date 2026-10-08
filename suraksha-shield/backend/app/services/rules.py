import re
from typing import List, Tuple
from app.schemas.scan import Evidence

# Basic rule engine
# English, Kannada, Hindi keywords
URGENCY_KEYWORDS = [
    "immediately", "blocked today", "urgent", "last warning", 
    "ತಕ್ಷಣವೇ", "ಇಂದು ನಿರ್ಬಂಧಿಸಲಾಗುತ್ತದೆ", 
    "तुरंत", "आज ब्लॉक कर दिया जाएगा"
]
KYC_KEYWORDS = [
    "kyc", "verify", "update account"
]
LINK_PATTERN = r"(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)"
OTP_KEYWORDS = ["otp", "pin", "password", "cvv"]
PRIZE_KEYWORDS = ["lottery", "prize", "won", "congratulations", "ಬಹಮಾನ", "लॉटरी"]

def detect_language(text: str) -> str:
    # simple heuristic
    if re.search(r'[\u0C80-\u0CFF]', text):
        return "kn"
    elif re.search(r'[\u0900-\u097F]', text):
        return "hi"
    return "en"

def analyze_text(text: str) -> Tuple[str, str, List[Evidence], List[str]]:
    evidence = []
    text_lower = text.lower()
    
    # Check Urgency
    for kw in URGENCY_KEYWORDS:
        for match in re.finditer(re.escape(kw), text_lower):
            evidence.append(Evidence(
                code="urgency",
                matched_text=text[match.start():match.end()],
                start=match.start(),
                end=match.end(),
                weight=0.5
            ))
            
    # Check KYC
    for kw in KYC_KEYWORDS:
        for match in re.finditer(re.escape(kw), text_lower):
            evidence.append(Evidence(
                code="kyc_impersonation",
                matched_text=text[match.start():match.end()],
                start=match.start(),
                end=match.end(),
                weight=0.4
            ))

    # Check Links
    for match in re.finditer(LINK_PATTERN, text):
        evidence.append(Evidence(
            code="suspicious_link",
            matched_text=match.group(0),
            start=match.start(),
            end=match.end(),
            weight=0.6
        ))

    # Check OTP/PIN
    for kw in OTP_KEYWORDS:
        for match in re.finditer(re.escape(kw), text_lower):
            evidence.append(Evidence(
                code="credential_theft",
                matched_text=text[match.start():match.end()],
                start=match.start(),
                end=match.end(),
                weight=0.8
            ))

    total_weight = sum([e.weight for e in evidence])
    
    if total_weight > 1.0:
        return "SCAM", "High", evidence, ["do_not_click", "report_1930"]
    elif total_weight > 0.0:
        return "SUSPICIOUS", "Medium", evidence, ["verify_source"]
    else:
        return "SAFE", "Low", [], ["verify_independently"]

def analyze_upi(upi_data: dict) -> Tuple[str, str, List[Evidence], List[str]]:
    evidence = []
    
    if upi_data.get('type') == 'Collect':
        evidence.append(Evidence(
            code="upi_collect",
            matched_text="Collect Request",
            start=0,
            end=0,
            weight=0.7
        ))
        
    note_lower = (upi_data.get('note') or "").lower()
    if "refund" in note_lower or "cashback" in note_lower:
        evidence.append(Evidence(
            code="refund_scam",
            matched_text="refund/cashback",
            start=0,
            end=0,
            weight=0.8
        ))
        
    total_weight = sum([e.weight for e in evidence])
    
    if total_weight > 1.0:
        return "SCAM", "High", evidence, ["decline_request", "report_1930"]
    elif total_weight > 0.0:
        return "SUSPICIOUS", "Medium", evidence, ["verify_caller"]
    else:
        return "SAFE", "Low", [], ["verify_independently"]
