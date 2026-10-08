import uuid
import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.result import ScanResult
from app.schemas.scan import (
    ScanRequest, ScanResponse, UpiScanRequest, ImageScanResponse, Evidence, SignalStrength, LearnTopic
)
from app.services.engine import analyze_message_content, analyze_upi_request_content
from app.services.ocr import validate_image_file, preprocess_and_extract_text
from app.translations.templates import REASON_TEMPLATES, ACTION_TEMPLATES

router = APIRouter(prefix="/api")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Suraksha Shield",
        "engine": "transparent_rules_v1",
        "languages_supported": ["en", "kn", "hi"]
    }

@router.post("/analyze/message", response_model=ScanResponse)
def analyze_message_endpoint(req: ScanRequest, db: Session = Depends(get_db)):
    clean_text = req.text.strip()
    if not clean_text:
        raise HTTPException(status_code=400, detail="Message text cannot be empty or solely whitespace.")
    if len(clean_text) > 4000:
        raise HTTPException(status_code=400, detail="Message exceeds maximum allowed length of 4000 characters.")

    result_dict = analyze_message_content(clean_text)
    scan_id = str(uuid.uuid4())

    # Store result
    stored_text = clean_text if req.consent_to_store else "[Stored with user consent masked]"
    
    db_result = ScanResult(
        id=scan_id,
        status=result_dict["status"],
        risk_level=result_dict["risk_level"],
        evidence_json=json.dumps([e.model_dump() for e in result_dict["evidence"]]),
        recommended_action_codes=",".join(result_dict["recommended_action_codes"]),
        detected_language=result_dict["detected_language"],
        analysis_method=result_dict["analysis_method"],
        original_text=stored_text
    )
    db.add(db_result)
    db.commit()

    return ScanResponse(
        id=scan_id,
        status=result_dict["status"],
        risk_level=result_dict["risk_level"],
        detected_language=result_dict["detected_language"],
        evidence=result_dict["evidence"],
        signals=result_dict["signals"],
        recommended_action_codes=result_dict["recommended_action_codes"],
        limitations=result_dict["limitations"],
        analysis_method=result_dict["analysis_method"],
        original_text=clean_text
    )

@router.post("/analyze/image", response_model=ImageScanResponse)
async def analyze_image_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    
    # Validation: file size, MIME, magic bytes
    is_valid, msg = validate_image_file(contents, file.filename or "screenshot.png")
    if not is_valid:
        raise HTTPException(status_code=400, detail=msg)

    # In-memory preprocessing and OCR execution
    text, engine, conf, status_desc = preprocess_and_extract_text(contents)
    
    return ImageScanResponse(
        extracted_text=text,
        confidence=conf,
        engine_used=engine,
        status="success" if text.strip() else "warning",
        message=status_desc
    )

@router.post("/analyze/upi", response_model=ScanResponse)
def analyze_upi_endpoint(req: UpiScanRequest, db: Session = Depends(get_db)):
    result_dict = analyze_upi_request_content(req.model_dump())
    scan_id = str(uuid.uuid4())

    stored_text = f"UPI {req.type} ₹{req.amount} ({req.requester})" if req.consent_to_store else "[Consent masked]"

    db_result = ScanResult(
        id=scan_id,
        status=result_dict["status"],
        risk_level=result_dict["risk_level"],
        evidence_json=json.dumps([e.model_dump() for e in result_dict["evidence"]]),
        recommended_action_codes=",".join(result_dict["recommended_action_codes"]),
        detected_language=result_dict["detected_language"],
        analysis_method=result_dict["analysis_method"],
        original_text=stored_text
    )
    db.add(db_result)
    db.commit()

    return ScanResponse(
        id=scan_id,
        status=result_dict["status"],
        risk_level=result_dict["risk_level"],
        detected_language=result_dict["detected_language"],
        evidence=result_dict["evidence"],
        signals=result_dict["signals"],
        recommended_action_codes=result_dict["recommended_action_codes"],
        limitations=result_dict["limitations"],
        analysis_method=result_dict["analysis_method"],
        original_text=result_dict["original_text"]
    )

@router.get("/results/{scan_id}", response_model=ScanResponse)
def get_result_endpoint(scan_id: str, db: Session = Depends(get_db)):
    db_result = db.query(ScanResult).filter(ScanResult.id == scan_id).first()
    if not db_result:
        raise HTTPException(status_code=404, detail="Scan result not found.")

    evidence_raw = json.loads(db_result.evidence_json or "[]")
    actions = [a for a in db_result.recommended_action_codes.split(",") if a] if db_result.recommended_action_codes else []

    evidence_list = [Evidence(**e) for e in evidence_raw]
    
    # Reconstruct signals
    cat_scores = {}
    for ev in evidence_list:
        cat_scores[ev.category] = cat_scores.get(ev.category, 0.0) + ev.weight
    signals = [
        SignalStrength(category=cat, level="High" if sc >= 0.8 else "Medium", score=round(sc, 2))
        for cat, sc in cat_scores.items()
    ]

    return ScanResponse(
        id=db_result.id,
        status=db_result.status,
        risk_level=db_result.risk_level,
        detected_language=db_result.detected_language or "en",
        evidence=evidence_list,
        signals=signals,
        recommended_action_codes=actions,
        limitations="Rules-based heuristic analysis. Verify independently.",
        analysis_method=db_result.analysis_method or "transparent_rules_v1",
        original_text=db_result.original_text
    )

@router.delete("/results/{scan_id}")
def delete_result_endpoint(scan_id: str, db: Session = Depends(get_db)):
    db_result = db.query(ScanResult).filter(ScanResult.id == scan_id).first()
    if not db_result:
        raise HTTPException(status_code=404, detail="Scan result not found.")
    db.delete(db_result)
    db.commit()
    return {"status": "deleted", "id": scan_id}

@router.get("/learn", response_model=List[LearnTopic])
def get_learn_topics_endpoint():
    topics = [
        LearnTopic(
            id="1",
            slug="fake-kyc",
            category="KYC Impersonation",
            title={
                "en": "Fake KYC & PAN Account Freeze Alerts",
                "kn": "ನಕಲಿ ಕೆವೈಸಿ ಮತ್ತು ಪ್ಯಾನ್ ಖಾತೆ ನಿರ್ಬಂಧಿಸುವ ಎಚ್ಚರಿಕೆಗಳು",
                "hi": "फर्जी केवाईसी और पैन खाता ब्लॉक अलर्ट"
            },
            summary={
                "en": "Scammers send urgent SMS claiming your bank account or SIM card will be deactivated today unless you click an unverified link to update KYC.",
                "kn": "ಕೆವೈಸಿ ಅಪ್‌ಡೇಟ್ ಮಾಡದಿದ್ದರೆ ಇಂದು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಅಥವಾ ಸಿಮ್ ರದ್ದಾಗುತ್ತದೆ ಎಂದು ನಕಲಿ ಲಿಂಕ್ ಕಳುಹಿಸಿ ವಂಚಿಸುತ್ತಾರೆ.",
                "hi": "धोखेबाज फर्जी मैसेज भेजते हैं कि यदि आपने लिंक पर क्लिक कर केवाईसी अपडेट नहीं किया तो आज खाता बंद हो जाएगा।"
            },
            example={
                "en": "Dear Customer, your SBI account is blocked today. Please update your PAN immediately at verify-kyc-bank.xyz",
                "kn": "ಗ್ರಾಹಕರೇ, ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ಇಂದು ಅಮಾನತುಗೊಳಿಸಲಾಗಿದೆ. verify-kyc-bank.xyz ನಲ್ಲಿ ತಕ್ಷಣ ಪ್ಯಾನ್ ನವೀಕರಿಸಿ",
                "hi": "प्रिय ग्राहक, आपका बैंक खाता आज ब्लॉक हो जाएगा। तुरंत verify-kyc-bank.xyz पर पैन अपडेट करें"
            },
            danger={
                "en": "The link leads to a cloned phishing site that steals your NetBanking username, password, and OTP.",
                "kn": "ಈ ಲಿಂಕ್ ನಕಲಿ ಬ್ಯಾಂಕಿಂಗ್ ಸೈಟ್‌ಗೆ ಕರೆದೊಯ್ದು ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ಒಟಿಪಿಯನ್ನು ಕದಿಯುತ್ತದೆ.",
                "hi": "यह लिंक एक नकली वेबसाइट पर ले जाता है जो आपका नेटबैंकिंग पासवर्ड और ओटीपी चुरा लेती है।"
            },
            warning_signs=[
                {"en": "Threatens immediate cutoff within 24 hours", "kn": "24 ಗಂಟೆಗಳಲ್ಲಿ ರದ್ದುಗೊಳಿಸುವ ಬೆದರಿಕೆ", "hi": "24 घंटे में सेवा बंद करने की धमकी"},
                {"en": "Contains an unverified web link or APK file", "kn": "ಅನಧಿಕೃತ ವೆಬ್ ಲಿಂಕ್ ಅಥವಾ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್", "hi": "अनाधिकृत वेब लिंक या एपीके फ़ाइल"}
            ],
            safe_actions=[
                {"en": "Banks NEVER send SMS links to update KYC. Visit your bank branch or use the official mobile app.", "kn": "ಬ್ಯಾಂಕುಗಳು ಎಂದಿಗೂ ಲಿಂಕ್ ಕಳುಹಿಸಿ ಕೆವೈಸಿ ಕೇಳುವುದಿಲ್ಲ. ನೇರವಾಗಿ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ.", "hi": "बैंक कभी भी एसएमएस में लिंक भेजकर केवाईसी नहीं मांगते। सीधे अपनी शाखा जाएं।"}
            ]
        ),
        LearnTopic(
            id="2",
            slug="otp-theft",
            category="Credential Theft",
            title={
                "en": "OTP & UPI PIN Theft",
                "kn": "ಒಟಿಪಿ ಮತ್ತು ಯುಪಿಐ ಪಿನ್ ಕಳ್ಳತನ",
                "hi": "ओटीपी और यूपीआई पिन चोरी"
            },
            summary={
                "en": "Attackers pose as bank staff, courier executives, or buyers and urge you to share an OTP or enter your UPI PIN to receive money.",
                "kn": "ಬ್ಯಾಂಕ್ ಸಿಬ್ಬಂದಿ ಅಥವಾ ಗ್ರಾಹಕರಂತೆ ಮಾತನಾಡಿ, ಹಣ ಪಡೆಯಲು ಒಟಿಪಿ ಹೇಳಿ ಅಥವಾ ಪಿನ್ ನಮೂದಿಸಿ ಎಂದು ವಂಚಿಸುತ್ತಾರೆ.",
                "hi": "धोखेबाज बैंक कर्मचारी या ग्राहक बनकर पैसे देने के बहाने आपसे ओटीपी या यूपीआई पिन मांगते हैं।"
            },
            example={
                "en": "I am sending you Rs 5,000 for your OLX item. Enter UPI PIN to credit the money into your account.",
                "kn": "ನಿಮ್ಮ ಖಾತೆಗೆ ₹5,000 ಕಳುಹಿಸುತ್ತಿದ್ದೇನೆ. ಹಣ ಪಡೆಯಲು ನಿಮ್ಮ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಿ.",
                "hi": "मैं आपको ₹5,000 भेज रहा हूँ। पैसे प्राप्त करने के लिए अपना यूपीआई पिन दर्ज करें।"
            },
            danger={
                "en": "Entering a UPI PIN NEVER receives money. Entering your PIN authorizes money to leave your account.",
                "kn": "ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಿದರೆ ಹಣ ಬರುವುದಿಲ್ಲ, ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತಗೊಳ್ಳುತ್ತದೆ.",
                "hi": "यूपीआई पिन डालने से कभी पैसे नहीं आते, बल्कि आपके खाते से पैसे कट जाते हैं।"
            },
            warning_signs=[
                {"en": "Caller asks for 4 or 6 digit secret UPI PIN", "kn": "4 ಅಥವಾ 6 ಅಂಕಿಯ ಯುಪಿಐ ಪಿನ್ ಕೇಳುವುದು", "hi": "4 या 6 अंकों का गुप्त यूपीआई पिन मांगना"},
                {"en": "Claims PIN is needed to receive payment", "kn": "ಹಣ ಜಮೆ ಮಾಡಲು ಪಿನ್ ಬೇಕೆಂದು ಹೇಳುವುದು", "hi": "पैसे प्राप्त करने के लिए पिन अनिवार्य बताना"}
            ],
            safe_actions=[
                {"en": "Golden Rule: UPI PIN is ONLY entered to SEND money, NEVER to receive money.", "kn": "ಚಿನ್ನದ ನಿಯಮ: ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ ಪಿನ್ ಬೇಕು, ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಪಿನ್ ಅಗತ್ಯವಿಲ್ಲ.", "hi": "स्वर्ण नियम: यूपीआई पिन केवल पैसे भेजने के लिए होता है, पैसे पाने के लिए कभी नहीं।"}
            ]
        ),
        LearnTopic(
            id="3",
            slug="lottery-prize",
            category="Prize Scam",
            title={
                "en": "Lottery, KBC & Reward Point Frauds",
                "kn": "ಲಾಟರಿ, ಕೆಬಿಸಿ ಮತ್ತು ಬಹುಮಾನದ ವಂಚನೆಗಳು",
                "hi": "लॉटरी, केबीसी और इनाम धोखाधड़ी"
            },
            summary={
                "en": "Fraudsters claim you won 25 Lakhs in KBC or car lottery, but ask you to pay a 'processing fee' or 'GST' in advance.",
                "kn": "ನೀವು ಲಕ್ಷಾಂತರ ರೂಪಾಯಿ ಲಾಟರಿ ಗೆದ್ದಿದ್ದೀರಿ ಎಂದು ಹೇಳಿ, ಜಿಎಸ್‌ಟಿ ಅಥವಾ ಪ್ರೊಸೆಸಿಂಗ್ ಶುಲ್ಕದ ಹೆಸರಿನಲ್ಲಿ ಮುಂಗಡ ಹಣ ಕೇಳುತ್ತಾರೆ.",
                "hi": "दावा करते हैं कि आपने केबीसी या लॉटरी में लाखों रुपये जीते हैं, लेकिन पहले 'प्रोसेसिंग शुल्क' जमा करने को कहते हैं।"
            },
            example={
                "en": "Congratulations! Your mobile number won Rs 25,00,000 in KBC Lottery. Deposit Rs 12,500 registration fee to claim.",
                "kn": "ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಸಂಖ್ಯೆಗೆ ₹25,00,000 ಲಾಟರಿ ಬಂದಿದೆ. ಪಡೆಯಲು ₹12,500 ನೋಂದಣಿ ಶುಲ್ಕ ಪಾವತಿಸಿ.",
                "hi": "बधाई हो! आपके नंबर ने केबीसी लॉटरी में ₹25,00,000 जीते हैं। क्लेम करने के लिए ₹12,500 रजिस्ट्रेशन शुल्क जमा करें।"
            },
            danger={
                "en": "Any advance fee sent is lost immediately, and scammers continue demanding more fees under fabricated pretexts.",
                "kn": "ಪಾವತಿಸಿದ ಶುಲ್ಕ ತಕ್ಷಣ ನಷ್ಟವಾಗುತ್ತದೆ ಮತ್ತು ಇನ್ನಷ್ಟು ಹಣಕ್ಕಾಗಿ ಪೀಡಿಸುತ್ತಾರೆ.",
                "hi": "दी गई राशि तुरंत डूब जाती है और वे टैक्स के नाम पर और पैसों की मांग करते रहते हैं।"
            },
            warning_signs=[
                {"en": "Winning a contest you never entered", "kn": "ನೀವು ಭಾಗವಹಿಸದ ಸ್ಪರ್ಧೆಯಲ್ಲಿ ಗೆಲುವು", "hi": "ऐसी प्रतियोगिता जीतना जिसमें भाग ही नहीं लिया"},
                {"en": "Requirement to pay advance fee to receive prize", "kn": "ಬಹುಮಾನ ಪಡೆಯಲು ಮುಂಗಡ ಶುಲ್ಕ ಕೇಳುವುದು", "hi": "इनाम पाने के लिए पहले पैसे जमा करने की शर्त"}
            ],
            safe_actions=[
                {"en": "Ignore and block immediately. Legitimate lotteries never ask for upfront payment.", "kn": "ತಕ್ಷಣ ನಿರ್ಬಂಧಿಸಿ. ಯಾವುದೇ ನಿಜವಾದ ಲಾಟರಿ ಮುಂಗಡ ಹಣ ಕೇಳುವುದಿಲ್ಲ.", "hi": "तुरंत ब्लॉक करें। कोई भी वैध संस्था इनाम के लिए पहले पैसे नहीं मांगती।"}
            ]
        ),
        LearnTopic(
            id="4",
            slug="upi-collect-requests",
            category="UPI Request Deception",
            title={
                "en": "Deceptive UPI Collect Requests",
                "kn": "ಮೋಸದ ಯುಪಿಐ ಕಲೆಕ್ಟ್ ವಿನಂತಿಗಳು",
                "hi": "धोखेबाज यूपीआई कलेक्ट रिक्वेस्ट"
            },
            summary={
                "en": "Scammers send a payment request (Collect) labeled 'Refund' or 'Prize Approval' hoping you tap 'Pay' and enter your PIN without reading.",
                "kn": "ಹಣ ಮರಳಿ ಪಡೆಯುವ ನೆಪದಲ್ಲಿ ಕಲೆಕ್ಟ್ ವಿನಂತಿ ಕಳುಹಿಸಿ, ನೀವು ಗಮನಿಸದೆ 'Pay' ಒತ್ತಿ ಪಿನ್ ನಮೂದಿಸುವಂತೆ ಮಾಡುತ್ತಾರೆ.",
                "hi": "धोखेबाज 'रिफंड' लिखकर कलेक्ट रिक्वेस्ट भेजते हैं ताकि आप बिना पढ़े 'Pay' दबाकर पिन डाल दें।"
            },
            example={
                "en": "Collect Request from support-refund@demo for Rs 4,999. Note: 'Approve to receive your shopping refund'",
                "kn": "support-refund@demo ನಿಂದ ₹4,999 ಕಲೆಕ್ಟ್ ವಿನಂತಿ. ಟಿಪ್ಪಣಿ: 'ರಿಫಂಡ್ ಪಡೆಯಲು ಅನುಮೋದಿಸಿ'",
                "hi": "support-refund@demo से ₹4,999 की कलेक्ट रिक्वेस्ट। नोट: 'रिफंड पाने के लिए अप्रूव करें'"
            },
            danger={
                "en": "Approving a collect request transfers the amount OUT of your bank account instantly.",
                "kn": "ಕಲೆಕ್ಟ್ ವಿನಂತಿ ಅನುಮೋದಿಸಿದರೆ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಯಿಂದ ಹಣ ತಕ್ಷಣ ಕಡಿತವಾಗುತ್ತದೆ.",
                "hi": "कलेक्ट रिक्वेस्ट स्वीकार करने से तुरंत आपके खाते से पैसे कट जाते हैं।"
            },
            warning_signs=[
                {"en": "Unexpected collect request notification on Google Pay / PhonePe / Paytm", "kn": "ಅಪರಿಚಿತರಿಂದ ಬಂದ ಕಲೆಕ್ಟ್ ವಿನಂತಿ ಅಧಿಸೂಚನೆ", "hi": "यूपीआई ऐप पर अचानक आई कलेक्ट रिक्वेस्ट"},
                {"en": "Note claims you will receive money after approving", "kn": "ಅನುಮೋದಿಸಿದರೆ ಹಣ ಸಿಗುತ್ತದೆ ಎಂದು ಟಿಪ್ಪಣಿ ಇರುವುದು", "hi": "नोट में लिखा होना कि अप्रूव करने पर पैसे मिलेंगे"}
            ],
            safe_actions=[
                {"en": "Always decline unsolicited collect requests. Contact the merchant solely through their official verified app.", "kn": "ಅಪರಿಚಿತ ಕಲೆಕ್ಟ್ ವಿನಂತಿಗಳನ್ನು ತಿರಸ್ಕರಿಸಿ (Decline).", "hi": "अवांछित कलेक्ट रिक्वेस्ट को हमेशा अस्वीकार (Decline) करें।"}
            ]
        ),
        LearnTopic(
            id="5",
            slug="remote-access",
            category="Remote Access & Screen Sharing",
            title={
                "en": "Remote Access & Screen-Sharing Fraud",
                "kn": "ರಿಮೋಟ್ ಆ್ಯಕ್ಸೆಸ್ ಮತ್ತು ಸ್ಕ್ರೀನ್-ಶೇರಿಂಗ್ ವಂಚನೆ",
                "hi": "रिमोट एक्सेस और स्क्रीन शेयरिंग धोखाधड़ी"
            },
            summary={
                "en": "Attackers ask you to download AnyDesk, TeamViewer or QuickSupport under the guise of technical troubleshooting.",
                "kn": "ತಾಂತ್ರಿಕ ಸಹಾಯದ ನೆಪದಲ್ಲಿ ಎನಿಡೆಸ್ಕ್ ಅಥವಾ ಟೀಮ್‌ವೀವರ್‌ನಂತಹ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಹೇಳುತ್ತಾರೆ.",
                "hi": "तकनीकी सहायता का झांसा देकर आपसे एनीडेस्क या क्विकसपोर्ट ऐप डाउनलोड करने को कहा जाता है।"
            },
            example={
                "en": "Customer Support: Please install AnyDesk from Play Store and tell me the 9-digit code to resolve your failed UPI transfer.",
                "kn": "ಗ್ರಾಹಕ ಸೇವೆ: ನಿಮ್ಮ ಹಣ ವರ್ಗಾವಣೆ ಸರಿಪಡಿಸಲು ಪ್ಲೇಸ್ಟೋರ್‌ನಿಂದ AnyDesk ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ 9 ಅಂಕಿಯ ಕೋಡ್ ಹೇಳಿ.",
                "hi": "कस्टमर केयर: अपनी अटकी हुई पेमेंट ठीक करने के लिए प्ले स्टोर से AnyDesk डाउनलोड करें और 9 अंकों का कोड बताएं।"
            },
            danger={
                "en": "Sharing the code allows the scammer to see your screen in real time, capturing your UPI PIN as you type it.",
                "kn": "ಕೋಡ್ ನೀಡಿದರೆ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸ್ಕ್ರೀನ್ ಅವರ ನಿಯಂತ್ರಣಕ್ಕೆ ಹೋಗುತ್ತದೆ ಮತ್ತು ನೀವು ಟೈಪ್ ಮಾಡುವ ಪಿನ್ ಅವರಿಗೆ ತಿಳಿಯುತ್ತದೆ.",
                "hi": "कोड साझा करते ही वे आपके फ़ोन की स्क्रीन देख सकते हैं और आपका यूपीआई पिन देखकर पैसे निकाल सकते हैं।"
            },
            warning_signs=[
                {"en": "Caller requests installation of screen sharing software", "kn": "ಸ್ಕ್ರೀನ್ ಶೇರಿಂಗ್ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಹೇಳುವುದು", "hi": "स्क्रीन शेयरिंग ऐप इंस्टॉल करने का आग्रह"},
                {"en": "Asks to read out a 9-digit remote access code", "kn": "9 ಅಂಕಿಯ ಆಕ್ಸೆಸ್ ಕೋಡ್ ಕೇಳುವುದು", "hi": "9 अंकों का रिमोट एक्सेस कोड मांगना"}
            ],
            safe_actions=[
                {"en": "Never install any app or share screen codes with unknown callers. Real bank support will never ask this.", "kn": "ಯಾರೊಂದಿಗೂ ಸ್ಕ್ರೀನ್ ಶೇರ್ ಮಾಡಬೇಡಿ. ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಸಿಬ್ಬಂದಿ ಇದನ್ನು ಎಂದಿಗೂ ಕೇಳುವುದಿಲ್ಲ.", "hi": "कभी किसी अज्ञात व्यक्ति के कहने पर ऐप इंस्टॉल न करें। बैंक कभी ऐसी मांग नहीं करते।"}
            ]
        ),
        LearnTopic(
            id="6",
            slug="fake-customer-support",
            category="Support Impersonation",
            title={
                "en": "Fake Customer Support & Google Search Numbers",
                "kn": "ನಕಲಿ ಗ್ರಾಹಕ ಸೇವೆ ಮತ್ತು ಗೂಗಲ್ ಸರ್ಚ್ ಸಂಖ್ಯೆಗಳು",
                "hi": "फर्जी कस्टमर केयर और गूगल सर्च नंबर"
            },
            summary={
                "en": "Scammers post fake toll-free helpline numbers on Google Maps and search results to trap users looking for bank or delivery support.",
                "kn": "ಬ್ಯಾಂಕ್ ಅಥವಾ ಡೆಲಿವರಿ ಸಹಾಯಕ್ಕಾಗಿ ಗೂಗಲ್‌ನಲ್ಲಿ ಹುಡುಕಿದಾಗ ಸಿಗುವ ನಕಲಿ ಸಂಖ್ಯೆಗಳನ್ನು ಹಾಕಿ ವಂಚಿಸುತ್ತಾರೆ.",
                "hi": "गूगल सर्च पर बैंक या ई-कॉमर्स कंपनियों के नाम पर फर्जी हेल्पलाइन नंबर डालकर ग्राहकों को फंसाया जाता है।"
            },
            example={
                "en": "Searched 'SBI Helpline' on Google and called an unverified mobile number +91 98765 43210 where caller asked for card details.",
                "kn": "ಗೂಗಲ್‌ನಲ್ಲಿ ಬ್ಯಾಂಕ್ ಸಹಾಯವಾಣಿ ಹುಡುಕಿ ಕರೆ ಮಾಡಿದಾಗ ಕಾರ್ಡ್ ವಿವರ ಕೇಳುವ ನಕಲಿ ವ್ಯಕ್ತಿಗಳು.",
                "hi": "गूगल पर 'बैंक हेल्पलाइन' सर्च कर कॉल करने पर सामने वाला व्यक्ति कार्ड की जानकारी मांगता है।"
            },
            danger={
                "en": "Criminals operate these phone numbers and guide victims into transferring money to 'test' accounts.",
                "kn": "ಇವರು ಗ್ರಾಹಕರನ್ನು ನಂಬಿಸಿ 'ಪರೀಕ್ಷಾರ್ಥ' ಖಾತೆಗೆ ಹಣ ವರ್ಗಾಯಿಸಲು ಹೇಳಿ ವಂಚಿಸುತ್ತಾರೆ.",
                "hi": "अपराधी खुद को अधिकारी बताकर 'टेस्टिंग' के नाम पर पैसे ट्रांसफर करवा लेते हैं।"
            },
            warning_signs=[
                {"en": "Helpline is a regular 10-digit mobile number instead of an official toll-free (1800) number", "kn": "ಟೋಲ್-ಫ್ರೀ ಬದಲಿಗೆ ಸಾಮಾನ್ಯ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಇರುವುದು", "hi": "टोल-फ्री के बजाय साधारण मोबाइल नंबर होना"},
                {"en": "Support executive asks to download an APK file or make a test payment", "kn": "ಪರೀಕ್ಷಾರ್ಥ ಪಾವತಿ ಮಾಡಲು ಹೇಳುವುದು", "hi": "टेस्ट पेमेंट करने के लिए कहना"}
            ],
            safe_actions=[
                {"en": "Always locate customer care numbers ONLY inside the official bank application or printed on your bank card.", "kn": "ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಕಾರ್ಡ್ ಹಿಂಭಾಗದಲ್ಲಿರುವ ಸಂಖ್ಯೆಗೆ ಮಾತ್ರ ಕರೆ ಮಾಡಿ.", "hi": "केवल अपने डेबिट कार्ड के पीछे लिखे नंबर या आधिकारिक ऐप से ही सहायता लें।"}
            ]
        ),
        LearnTopic(
            id="7",
            slug="qr-code-misunderstandings",
            category="QR Code Fraud",
            title={
                "en": "QR Code Payment Misunderstandings",
                "kn": "ಕ್ಯೂಆರ್ ಕೋಡ್ ಪಾವತಿಯ ತಪ್ಪು ಕಲ್ಪನೆಗಳು",
                "hi": "क्यूआर कोड पेमेंट के भ्रम"
            },
            summary={
                "en": "Scammers send a QR code on WhatsApp saying 'Scan this code to receive advance token for your sale'.",
                "kn": "ಮಾರಾಟದ ಮುಂಗಡ ಹಣ ಪಡೆಯಲು ಈ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಎಂದು ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಕಳುಹಿಸಿ ವಂಚಿಸುತ್ತಾರೆ.",
                "hi": "सामान खरीदने के बहाने व्हाट्सएप पर क्यूआर कोड भेजकर कहते हैं कि 'पैसे पाने के लिए इसे स्कैन करें'।"
            },
            example={
                "en": "Buyer on OLX: 'I have generated a receiving QR code for ₹8,500. Just scan it in your GPay to get the cash.'",
                "kn": "ಖರೀದಿದಾರ: '₹8,500 ಪಡೆಯಲು ಈ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ತಕ್ಷಣ ಹಣ ನಿಮ್ಮ ಖಾತೆಗೆ ಬರುತ್ತದೆ.'",
                "hi": "खरीदार: 'मैंने ₹8,500 का क्यूआर कोड भेजा है। अपने गूगल पे से स्कैन करते ही पैसे मिल जाएंगे।'"
            },
            danger={
                "en": "Scanning a QR code is strictly for SENDING money. Scanning a QR code will debited funds from your account.",
                "kn": "ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡುವುದು ಹಣ ಕಳುಹಿಸಲು ಮಾತ್ರ. ಸ್ಕ್ಯಾನ್ ಮಾಡಿದರೆ ನಿಮ್ಮಿಂದ ಹಣ ಹೋಗುತ್ತದೆ.",
                "hi": "क्यूआर कोड स्कैन करना केवल पैसे देने के लिए होता है। इसे स्कैन करते ही आपके पैसे कट जाएंगे।"
            },
            warning_signs=[
                {"en": "Claims scanning QR code will deposit money into your account", "kn": "ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿದರೆ ಹಣ ಬರುತ್ತದೆ ಎಂದು ಹೇಳುವುದು", "hi": "क्यूआर स्कैन करने पर पैसे आने का दावा करना"}
            ],
            safe_actions=[
                {"en": "NEVER scan a QR code to receive money. Share solely your UPI ID or phone number to get paid.", "kn": "ಹಣ ಪಡೆಯಲು ಎಂದಿಗೂ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಬೇಡಿ.", "hi": "पैसे लेने के लिए कभी क्यूआर कोड स्कैन न करें। केवल अपना यूपीआई नंबर साझा करें।"}
            ]
        ),
        LearnTopic(
            id="8",
            slug="loan-job-offer",
            category="Instant Loan & Part-Time Job Scams",
            title={
                "en": "Fake Instant Loan & Part-time Job Scams",
                "kn": "ನಕಲಿ ಸಾಲ ಮತ್ತು ಪಾರ್ಟ್-ಟೈಮ್ ಉದ್ಯೋಗ ವಂಚನೆ",
                "hi": "फर्जी लोन और पार्ट-टाइम जॉब घोटाले"
            },
            summary={
                "en": "Unsolicited WhatsApp messages promising 10-minute instant loans without documentation or Rs 5,000/day for liking YouTube videos.",
                "kn": "ದಾಖಲೆಗಳಿಲ್ಲದೆ 10 ನಿಮಿಷದಲ್ಲಿ ಸಾಲ ಅಥವಾ ಯೂಟ್ಯೂಬ್ ಲೈಕ್ ಮಾಡಿದರೆ ದಿನಕ್ಕೆ ₹5,000 ಗಳಿಸುವ ನಕಲಿ ಆಮಿಷ.",
                "hi": "बिना दस्तावेज 10 मिनट में लोन या यूट्यूब वीडियो लाइक करके रोजाना ₹5,000 कमाने के फर्जी मैसेज।"
            },
            example={
                "en": "Pre-approved loan of Rs 5,00,000 sanctioned. Download our quick-loan app at fastloan-cash.apk to disburse immediately.",
                "kn": "ನಿಮಗೆ ₹5,00,000 ಸಾಲ ಮಂಜೂರಾಗಿದೆ. ಹಣ ಪಡೆಯಲು fastloan-cash.apk ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.",
                "hi": "आपका ₹5,00,000 का लोन मंजूर हो गया है। राशि पाने के लिए fastloan-cash.apk ऐप डाउनलोड करें।"
            },
            danger={
                "en": "Rogue loan APKs steal your entire contact list and photos, followed by harassment and extortion.",
                "kn": "ನಕಲಿ ಆ್ಯಪ್‌ಗಳು ನಿಮ್ಮ ಫೋನ್ ಕಾಂಟ್ಯಾಕ್ಟ್‌ಗಳು ಮತ್ತು ಫೋಟೋಗಳನ್ನು ಕದ್ದು ಬೆದರಿಕೆ ಹಾಕುತ್ತವೆ.",
                "hi": "फर्जी लोन ऐप्स आपके कॉन्टैक्ट्स और तस्वीरें चुराकर ब्लैकमेल करते हैं।"
            },
            warning_signs=[
                {"en": "Unsolicited loan approval without credit checks or application", "kn": "ಅರ್ಜಿ ಸಲ್ಲಿಸದೆಯೇ ಸಾಲ ಮಂಜೂರಾಗಿದೆ ಎಂಬ ಸಂದೇಶ", "hi": "बिना आवेदन के लोन पास होने का मैसेज"},
                {"en": "Demands installing an untrusted APK outside Google Play Store", "kn": "ಪ್ಲೇಸ್ಟೋರ್ ಹೊರಗಿನ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಒತ್ತಾಯಿಸುವುದು", "hi": "प्ले स्टोर के बाहर से एपीके फ़ाइल डाउनलोड करवाना"}
            ],
            safe_actions=[
                {"en": "Only borrow from RBI-registered banks and NBFCs through verified apps on official app stores.", "kn": "ಆರ್‌ಬಿಐ ನೋಂದಾಯಿತ ಬ್ಯಾಂಕುಗಳಿಂದ ಮಾತ್ರ ಅಧಿಕೃತವಾಗಿ ಸಾಲ ಪಡೆಯಿರಿ.", "hi": "केवल आरबीआई से पंजीकृत बैंकों या संस्थाओं से ही आधिकारिक रूप से लोन लें।"}
            ]
        )
    ]
    return topics
