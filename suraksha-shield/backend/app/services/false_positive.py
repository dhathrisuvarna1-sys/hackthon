import re
from typing import List, Dict, Any, Tuple

# Patterns representing legitimate safety advice or standard transactional notifications
SAFETY_ADVICE_PATTERNS = [
    # English
    r"\b(?:never share (?:your )?otp|do not share (?:your )?otp|bank never asks for otp|keep your pin confidential|beware of fraud|safety tip|never disclose (?:your )?password)\b",
    # Kannada
    r"(?:ನಿಮ್ಮ ಒಟಿಪಿಯನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ|ಬ್ಯಾಂಕ್ ಎಂದಿಗೂ ಒಟಿಪಿ ಕೇಳುವುದಿಲ್ಲ|ಪಿನ್ ಗೌಪ್ಯವಾಗಿಡಿ|ವಂಚನೆಯಿಂದ ಎಚ್ಚರ)",
    # Hindi
    r"(?:अपना ओटीपी किसी के साथ साझा न करें|बैंक कभी ओटीपी नहीं मांगता|पिन किसी को न बताएं|धोखाधड़ी से सावधान रहें)"
]

LEGIT_TRANSACTION_PATTERNS = [
    # Standard debit/credit notifications from legitimate banks
    r"\b(?:debited for (?:rs|inr)|credited with (?:rs|inr)|available balance is|txn id|ref no:)\b",
    r"(?:ಖಾತೆಯಿಂದ ಕಡಿತಗೊಳಿಸಲಾಗಿದೆ|ಖಾತೆಗೆ ಜಮೆಯಾಗಿದೆ|ಲಭ್ಯವಿರುವ ಬ್ಯಾಲೆನ್ಸ್)",
    r"(?:खाते से डेबिट किया गया|खाते में क्रेडिट किया गया|उपलब्ध बैलेंस)"
]

def filter_false_positives(text: str, evidence: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], bool]:
    """
    Evaluates context to prevent false positives:
    - If the message is a security tip ("Never share your OTP"), credential matches are neutralized.
    - If evidence is solely a single innocuous keyword without malicious context, flags are tempered.
    Returns (filtered_evidence, is_safety_notice)
    """
    text_lower = text.lower()
    
    # Check if this is an explicit security warning
    is_safety_warning = False
    for pat in SAFETY_ADVICE_PATTERNS:
        if re.search(pat, text_lower if pat.isascii() else text, re.IGNORECASE):
            is_safety_warning = True
            break

    if is_safety_warning:
        # Strip out credential theft accusations that actually matched safety advice!
        filtered = [
            e for e in evidence 
            if e["code"] not in ["credential_theft", "urgency"]
        ]
        return filtered, True

    # Check if this is a standard bank debit/credit confirmation without suspicious links
    is_legit_txn = any(
        re.search(pat, text_lower if pat.isascii() else text, re.IGNORECASE)
        for pat in LEGIT_TRANSACTION_PATTERNS
    )
    has_high_risk_evidence = any(
        e["code"] in ["credential_theft", "kyc_impersonation", "refund_scam", "remote_access_fraud"]
        for e in evidence
    )
    
    if is_legit_txn and not has_high_risk_evidence:
        # If it's a standard debit/credit alert and only has a generic link or amount, lower its weight
        filtered = []
        for e in evidence:
            if e["code"] == "unverified_link":
                filtered.append({**e, "weight": 0.2})
            elif e["code"] == "urgency":
                filtered.append({**e, "weight": 0.2})
            else:
                filtered.append(e)
        return filtered, False

    return evidence, False
