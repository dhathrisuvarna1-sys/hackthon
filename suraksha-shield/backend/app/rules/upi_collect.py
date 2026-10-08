import re
from typing import List, Dict, Any

def check_upi_collect_context(upi_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    matches = []
    is_collect = upi_data.get("type", "").lower() == "collect"
    note = (upi_data.get("note") or "").lower()
    requester = (upi_data.get("requester") or "").lower()
    
    # 1. Collect request with refund / cashback / reward claim
    if is_collect and any(kw in note for kw in ["refund", "cashback", "reward", "prize", "lottery", "bonus", "रिफ़ंड", "ರಿಫಂಡ್"]):
        matches.append({
            "code": "collect_reverse_deception",
            "category": "Collect Reversal Fraud",
            "matched_text": f"Collect request labeled as '{upi_data.get('note')}'",
            "start": 0,
            "end": 0,
            "weight": 0.95,
            "description": "Deceptive collect request: You are being asked to APPROVE a debit while the note falsely claims you will receive money."
        })

    # 2. Impersonating customer support on collect request
    if is_collect and any(kw in requester for kw in ["support", "customer care", "helpdesk", "refund desk", "amazon care", "flipkart care", "bank"]):
        matches.append({
            "code": "collect_impersonation",
            "category": "Customer Support Impersonation",
            "matched_text": f"Requester: {upi_data.get('requester')}",
            "start": 0,
            "end": 0,
            "weight": 0.80,
            "description": "Unsolicited collect request from an entity claiming to be support or customer care."
        })

    # 3. High amount with urgent note
    if is_collect and any(kw in note for kw in ["urgent", "immediately", "emergency", "penalty"]):
        matches.append({
            "code": "collect_urgency",
            "category": "High Pressure Payment",
            "matched_text": f"Urgent note: '{upi_data.get('note')}'",
            "start": 0,
            "end": 0,
            "weight": 0.60,
            "description": "High-pressure collect request demanding rapid authorization without verification."
        })

    return matches
