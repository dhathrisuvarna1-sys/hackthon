import pytest
from app.services.engine import analyze_message_content, analyze_upi_request_content
from app.services.normalizer import normalize_text, detect_language

def test_language_detection():
    assert detect_language("Hello your bank account is blocked") == "en"
    assert detect_language("ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಅಮಾನತುಗೊಂಡಿದೆ") == "kn"
    assert detect_language("आपका बैंक खाता ब्लॉक कर दिया गया है") == "hi"

def test_fake_kyc_detection():
    text = "Dear customer, your SBI account is blocked today. Complete KYC immediately at http://sbi-kyc-update.xyz"
    res = analyze_message_content(text)
    assert res["status"] == "SCAM"
    assert res["risk_level"] == "High"
    codes = [e.code for e in res["evidence"]]
    assert "kyc_impersonation" in codes
    assert "urgency" in codes
    assert any("link" in c for c in codes)

def test_otp_theft_detection():
    text = "Urgent: share your OTP with customer support to prevent account termination."
    res = analyze_message_content(text)
    assert res["status"] == "SCAM"
    codes = [e.code for e in res["evidence"]]
    assert "credential_theft" in codes

def test_lottery_scam():
    text = "Congratulations! You won a lottery of Rs 25,00,000 in KBC lucky draw. Deposit fee to claim."
    res = analyze_message_content(text)
    assert res["status"] in ["SCAM", "SUSPICIOUS"]
    codes = [e.code for e in res["evidence"]]
    assert "lottery_fraud" in codes

def test_remote_access_scam():
    text = "To resolve failed payment, install AnyDesk and provide the 9-digit code immediately."
    res = analyze_message_content(text)
    assert res["status"] == "SCAM"
    codes = [e.code for e in res["evidence"]]
    assert "remote_access_fraud" in codes

def test_kannada_scam():
    text = "ಗ್ರಾಹಕರೇ, ನಿಮ್ಮ ಖಾತೆ ಇಂದು ನಿರ್ಬಂಧಿಸಲಾಗುತ್ತದೆ. ತಕ್ಷಣವೇ ಪರಿಶೀಲಿಸಿ."
    res = analyze_message_content(text)
    assert res["status"] in ["SCAM", "SUSPICIOUS"]
    assert res["detected_language"] == "kn"

def test_hindi_scam():
    text = "प्रिय ग्राहक, आपका बैंक खाता आज ही ब्लॉक कर दिया जाएगा। तुरंत केवाईसी अपडेट करें।"
    res = analyze_message_content(text)
    assert res["status"] == "SCAM"
    assert res["detected_language"] == "hi"

def test_false_positive_otp_warning():
    # A legitimate bank safety tip should NOT trigger scam!
    text = "Never share your OTP with anyone. Bank never asks for OTP or PIN. Stay vigilant."
    res = analyze_message_content(text)
    assert res["status"] == "SAFE"
    assert res["risk_level"] == "Low"

def test_legitimate_transaction_notification():
    text = "Rs 450.00 debited from A/c XX1234 on 08-Oct-26 at Grocery Mart. Available balance is Rs 12,450.00."
    res = analyze_message_content(text)
    assert res["status"] == "SAFE"
    assert res["risk_level"] == "Low"

def test_upi_collect_deceptive():
    upi_data = {
        "requester": "Customer Support Desk",
        "upi_id": "support-refund@demo",
        "amount": "4999",
        "type": "Collect",
        "note": "Approve to receive your refund"
    }
    res = analyze_upi_request_content(upi_data)
    assert res["status"] == "SCAM"
    assert res["risk_level"] == "High"
    codes = [e.code for e in res["evidence"]]
    assert "collect_reverse_deception" in codes
