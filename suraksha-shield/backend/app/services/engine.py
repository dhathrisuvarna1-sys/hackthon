from typing import List, Dict, Any, Tuple
from app.schemas.scan import Evidence, SignalStrength
from app.services.normalizer import normalize_text, detect_language
from app.rules import run_all_text_rules, check_upi_collect_context
from app.services.false_positive import filter_false_positives

def analyze_message_content(raw_text: str) -> Dict[str, Any]:
    """
    Orchestrates the 5-layer fraud detection pipeline:
    Layer 1: Normalization & Language detection
    Layer 2: Modular Rules evaluation
    Layer 3: Classifier interface (transparent rules-first)
    Layer 4: Decision engine (SAFE / SUSPICIOUS / SCAM)
    Layer 5: False-positive prevention
    """
    normalized = normalize_text(raw_text)
    detected_lang = detect_language(normalized)

    # Layer 2 rules
    raw_evidence = run_all_text_rules(normalized)

    # Layer 5 false-positive filtering
    filtered_evidence, is_safety_notice = filter_false_positives(normalized, raw_evidence)

    # Deduplicate overlapping matches by code and span
    seen_spans = set()
    unique_evidence = []
    for item in filtered_evidence:
        span_key = (item["code"], item["start"], item["end"])
        if span_key not in seen_spans:
            seen_spans.add(span_key)
            unique_evidence.append(item)

    # Compute category weights and signal strength
    category_scores: Dict[str, float] = {}
    total_weight = 0.0

    for item in unique_evidence:
        w = item["weight"]
        total_weight += w
        cat = item["category"]
        category_scores[cat] = category_scores.get(cat, 0.0) + w

    signals: List[SignalStrength] = []
    for cat, score in category_scores.items():
        level = "High" if score >= 0.8 else ("Medium" if score >= 0.5 else "Low")
        signals.append(SignalStrength(
            category=cat,
            level=level,
            score=round(score, 2)
        ))

    # Layer 4 Decision Logic
    # Qualitative decision:
    # SCAM: High confidence malicious signals (total weight >= 1.0 or any single weight >= 0.85)
    # SUSPICIOUS: Notable warnings requiring caution (0 < total weight < 1.0)
    # SAFE: Low risk indicators detected (total weight == 0)
    
    if is_safety_notice and not any(e["weight"] >= 0.85 for e in unique_evidence):
        status = "SAFE"
        risk_level = "Low"
        recommended_actions = ["verify_independently"]
    elif total_weight >= 1.0 or any(e["weight"] >= 0.85 for e in unique_evidence):
        status = "SCAM"
        risk_level = "High"
        recommended_actions = [
            "do_not_share_otp",
            "do_not_click_link",
            "block_sender",
            "verify_official_bank",
            "report_1930"
        ]
    elif total_weight > 0.0:
        status = "SUSPICIOUS"
        risk_level = "Medium"
        recommended_actions = [
            "verify_independently",
            "never_share_pin",
            "check_official_app"
        ]
    else:
        status = "SAFE"
        risk_level = "Low"
        recommended_actions = [
            "verify_independently"
        ]

    pydantic_evidence = [
        Evidence(
            code=e["code"],
            category=e["category"],
            matched_text=e["matched_text"],
            start=e["start"],
            end=e["end"],
            weight=e["weight"],
            description=e.get("description")
        )
        for e in unique_evidence
    ]

    return {
        "status": status,
        "risk_level": risk_level,
        "detected_language": detected_lang,
        "evidence": pydantic_evidence,
        "signals": signals,
        "recommended_action_codes": recommended_actions,
        "limitations": "Rules-based heuristic analysis. No automated system can guarantee safety; independent verification through official bank channels is mandatory.",
        "analysis_method": "transparent_rules_v1",
        "original_text": raw_text
    }

def analyze_upi_request_content(upi_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Contextual analysis for UPI payment and collect requests.
    """
    raw_evidence = check_upi_collect_context(upi_data)
    total_weight = sum(e["weight"] for e in raw_evidence)

    category_scores: Dict[str, float] = {}
    for item in raw_evidence:
        w = item["weight"]
        cat = item["category"]
        category_scores[cat] = category_scores.get(cat, 0.0) + w

    signals: List[SignalStrength] = [
        SignalStrength(
            category=cat,
            level="High" if score >= 0.8 else "Medium",
            score=round(score, 2)
        )
        for cat, score in category_scores.items()
    ]

    is_collect = upi_data.get("type", "").lower() == "collect"

    if total_weight >= 0.9 or any(e["weight"] >= 0.85 for e in raw_evidence):
        status = "SCAM"
        risk_level = "High"
        recommended_actions = [
            "decline_collect_request",
            "never_enter_pin_to_receive",
            "block_upi_id",
            "report_1930"
        ]
    elif total_weight > 0.0 or is_collect:
        status = "SUSPICIOUS"
        risk_level = "Medium"
        recommended_actions = [
            "verify_requester_identity",
            "remember_collect_sends_money_out",
            "decline_if_unexpected"
        ]
    else:
        status = "SAFE"
        risk_level = "Low"
        recommended_actions = [
            "verify_independently"
        ]

    pydantic_evidence = [
        Evidence(
            code=e["code"],
            category=e["category"],
            matched_text=e["matched_text"],
            start=e["start"],
            end=e["end"],
            weight=e["weight"],
            description=e.get("description")
        )
        for e in raw_evidence
    ]

    return {
        "status": status,
        "risk_level": risk_level,
        "detected_language": "en",
        "evidence": pydantic_evidence,
        "signals": signals,
        "recommended_action_codes": recommended_actions,
        "limitations": "UPI request analysis based on context and payment intent rules. Official bank/app confirmation is always advised.",
        "analysis_method": "transparent_rules_v1",
        "original_text": f"UPI {upi_data.get('type')} ₹{upi_data.get('amount')} from {upi_data.get('requester')} ({upi_data.get('upi_id')})"
    }
