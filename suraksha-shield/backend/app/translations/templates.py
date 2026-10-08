from typing import Dict, Any

REASON_TEMPLATES: Dict[str, Dict[str, str]] = {
    "urgency": {
        "en": "Creates artificial urgency or threatens imminent account suspension.",
        "kn": "ಖಾತೆ ರದ್ದಾಗುತ್ತದೆ ಎಂದು ನಕಲಿ ತುರ್ತು ಎಚ್ಚರಿಕೆಯನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ.",
        "hi": "खाता बंद होने की झूठी धमकी देकर तुरंत कार्रवाई का दबाव बनाता है।"
    },
    "kyc_impersonation": {
        "en": "Demands immediate KYC or PAN updates via unofficial links.",
        "kn": "ಅನಧಿಕೃತ ಲಿಂಕ್ ಮೂಲಕ ಕೆವೈಸಿ ಅಥವಾ ಪ್ಯಾನ್ ನವೀಕರಿಸಲು ಒತ್ತಾಯಿಸುತ್ತದೆ.",
        "hi": "अनाधिकृत लिंक के माध्यम से केवाईसी या पैन अपडेट करने की मांग करता है।"
    },
    "credential_theft": {
        "en": "Attempts to solicit your secret OTP, UPI PIN, or password.",
        "kn": "ನಿಮ್ಮ ರಹಸ್ಯ ಒಟಿಪಿ, ಯುಪಿಐ ಪಿನ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಕದಿಯಲು ಯತ್ನಿಸುತ್ತದೆ.",
        "hi": "आपका गोपनीय ओटीपी, यूपीआई पिन या पासवर्ड हासिल करने की कोशिश करता है।"
    },
    "suspicious_link": {
        "en": "Contains a deceptive short link, APK download, or lookalike domain.",
        "kn": "ಅಪಾಯಕಾರಿ ಶಾರ್ಟ್ ಲಿಂಕ್ ಅಥವಾ ನಕಲಿ ವೆಬ್ ವಿಳಾಸವನ್ನು ಒಳಗೊಂಡಿದೆ.",
        "hi": "संदिग्ध छोटा लिंक या बैंक जैसा दिखने वाला फर्जी डोमेन शामिल है।"
    },
    "unverified_link": {
        "en": "Points to an unverified external website.",
        "kn": "ದೃಢೀಕರಿಸದ ಹೊರಗಿನ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಕರೆದೊಯ್ಯುತ್ತದೆ.",
        "hi": "एक असत्यापित बाहरी वेबसाइट पर ले जाता है।"
    },
    "lottery_fraud": {
        "en": "Promises fake lottery winnings, prizes, or reward points.",
        "kn": "ಸುಳ್ಳು ಲಾಟರಿ ಗೆಲುವು ಅಥವಾ ನಕಲಿ ಬಹುಮಾನದ ಆಮಿಷ ಒಡ್ಡುತ್ತದೆ.",
        "hi": "फर्जी लॉटरी, इनाम या रिवॉर्ड पॉइंट्स का लालच देता है।"
    },
    "refund_scam": {
        "en": "Tricks you into approving a debit to receive a fake refund or cashback.",
        "kn": "ರಿಫಂಡ್ ಅಥವಾ ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ನೀಡುವ ನೆಪದಲ್ಲಿ ನಿಮ್ಮ ಖಾತೆಯಿಂದ ಹಣ ಕಡಿತಗೊಳಿಸಲು ಯತ್ನಿಸುತ್ತದೆ.",
        "hi": "रिफंड या कैशबैक देने के बहाने आपके खाते से पैसे काटने की कोशिश करता है।"
    },
    "authority_impersonation": {
        "en": "Falsely poses as an electricity board, telecom official, police, or bank manager.",
        "kn": "ವಿದ್ಯುತ್ ಮಂಡಳಿ, ಟೆಲಿಕಾಂ, ಪೊಲೀಸ್ ಅಥವಾ ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿಯಂತೆ ಸೋಗು ಹಾಕುತ್ತದೆ.",
        "hi": "बिजली विभाग, टेलीकॉम, पुलिस या बैंक अधिकारी का झूठा रूप धारण करता है।"
    },
    "payment_pressure": {
        "en": "Coerces immediate payment through intimidation and threats of legal action.",
        "kn": "ಕಾನೂನು ಕ್ರಮ ಅಥವಾ ದಂಡದ ಬೆದರಿಕೆ ಹಾಕಿ ತಕ್ಷಣ ಹಣ ನೀಡುವಂತೆ ಒತ್ತಡ ಹೇರುತ್ತದೆ.",
        "hi": "कानूनी कार्रवाई या जुर्माने का डर दिखाकर तुरंत भुगतान का दबाव बनाता है।"
    },
    "remote_access_fraud": {
        "en": "Instructs you to install a screen-sharing app like AnyDesk or TeamViewer.",
        "kn": "ಎನಿಡೆಸ್ಕ್ ಅಥವಾ ಟೀಮ್‌ವೀವರ್‌ನಂತಹ ಸ್ಕ್ರೀನ್‌ಶೇರಿಂಗ್ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸೂಚಿಸುತ್ತದೆ.",
        "hi": "एनीडेस्क या टीमव्यूअर जैसी स्क्रीन शेयरिंग ऐप डाउनलोड करने के लिए कहता है।"
    },
    "collect_reverse_deception": {
        "en": "Disguises a debit Collect Request as a refund or reward deposit.",
        "kn": "ಹಣ ಪಡೆಯುವ ಬದಲು ಹಣ ಕಳುಹಿಸುವ ಕಲೆಕ್ಟ್ ವಿನಂತಿಯನ್ನು ಮರೆಮಾಚಿ ಕಳುಹಿಸಲಾಗಿದೆ.",
        "hi": "पैसे मिलने का झांसा देकर पैसे कटने वाली कलेक्ट रिक्वेस्ट भेजी गई है।"
    },
    "collect_impersonation": {
        "en": "Unsolicited payment request from an entity impersonating customer support.",
        "kn": "ಗ್ರಾಹಕ ಸೇವಾ ಕೇಂದ್ರದಂತೆ ಸೋಗು ಹಾಕಿದವರಿಂದ ಬಂದ ಅನಪೇಕ್ಷಿತ ಹಣದ ವಿನಂತಿ.",
        "hi": "कस्टमर सपोर्ट का झूठा दावा करने वाले व्यक्ति से आई भुगतान रिक्वेस्ट।"
    }
}

ACTION_TEMPLATES: Dict[str, Dict[str, str]] = {
    "do_not_share_otp": {
        "en": "Never share your OTP, UPI PIN, or passwords with anyone.",
        "kn": "ನಿಮ್ಮ ಒಟಿಪಿ, ಯುಪಿಐ ಪಿನ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
        "hi": "अपना ओटीपी, यूपीआई पिन या पासवर्ड कभी किसी के साथ साझा न करें।"
    },
    "do_not_click_link": {
        "en": "Do not tap on any link or download any attachment in this message.",
        "kn": "ಈ ಸಂದೇಶದಲ್ಲಿರುವ ಯಾವುದೇ ಲಿಂಕ್ ಒತ್ತಬೇಡಿ ಅಥವಾ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬೇಡಿ.",
        "hi": "इस संदेश में दिए गए किसी भी लिंक पर क्लिक न करें और कोई फ़ाइल डाउनलोड न करें।"
    },
    "block_sender": {
        "en": "Block the sender number or UPI ID immediately on your phone.",
        "kn": "ಕಳುಹಿಸಿದವರ ಸಂಖ್ಯೆ ಅಥವಾ ಯುಪಿಐ ಐಡಿಯನ್ನು ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ತಕ್ಷಣ ನಿರ್ಬಂಧಿಸಿ (Block).",
        "hi": "भेजने वाले का नंबर या यूपीआई आईडी अपने फ़ोन पर तुरंत ब्लॉक करें।"
    },
    "verify_official_bank": {
        "en": "Verify directly by opening your official bank app or dialing the number printed on your debit card.",
        "kn": "ನಿಮ್ಮ ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಆ್ಯಪ್ ತೆರೆದು ಅಥವಾ ಡೆಬಿಟ್ ಕಾರ್ಡ್ ಮೇಲಿರುವ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
        "hi": "अपने आधिकारिक बैंक ऐप को खोलकर या अपने डेबिट कार्ड पर लिखे नंबर पर कॉल करके पुष्टि करें।"
    },
    "report_1930": {
        "en": "If you lost money or suspect fraud, dial National Cyber Crime Helpline 1930 or visit cybercrime.gov.in.",
        "kn": "ಹಣ ಕಳೆದುಕೊಂಡಿದ್ದರೆ ತಕ್ಷಣ ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಕ್ರೈಮ್ ಸಹಾಯವಾಣಿ 1930 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ cybercrime.gov.in ಗೆ ಭೇಟಿ ನೀಡಿ.",
        "hi": "यदि पैसे कट गए हों तो तुरंत राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पर रिपोर्ट करें।"
    },
    "verify_independently": {
        "en": "Low risk indicators detected. No obvious scam signs found. Always verify independently before transferring money.",
        "kn": "ಕಡಿಮೆ ಅಪಾಯದ ಸೂಚನೆಗಳು. ಯಾವುದೇ ಸ್ಪಷ್ಟ ವಂಚನೆಯ ಲಕ್ಷಣಗಳಿಲ್ಲ. ಹಣ ವರ್ಗಾಯಿಸುವ ಮುನ್ನ ಅಧಿಕೃತವಾಗಿ ಪರಿಶೀಲಿಸಿ.",
        "hi": "कम जोखिम के संकेत। कोई स्पष्ट धोखाधड़ी नहीं मिली। पैसे भेजने से पहले स्वतंत्र रूप से पुष्टि अवश्य करें।"
    },
    "decline_collect_request": {
        "en": "Decline the collect request. Entering your UPI PIN will send money OUT, not receive money.",
        "kn": "ಕಲೆಕ್ಟ್ ವಿನಂತಿಯನ್ನು ತಿರಸ್ಕರಿಸಿ. ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸಿದರೆ ನಿಮ್ಮಿಂದ ಹಣ ಕಡಿತವಾಗುತ್ತದೆ, ಹಣ ಬರುವುದಿಲ್ಲ.",
        "hi": "कलेक्ट रिक्वेस्ट को अस्वीकार करें। यूपीआई पिन दर्ज करने से पैसे कटते हैं, आते नहीं।"
    },
    "never_enter_pin_to_receive": {
        "en": "Remember: You NEVER need to enter a UPI PIN or scan a QR code to receive money.",
        "kn": "ನೆನಪಿಡಿ: ಹಣ ಪಡೆಯಲು ನೀವು ಎಂದಿಗೂ ಯುಪಿಐ ಪಿನ್ ನಮೂದಿಸುವ ಅಥವಾ ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ.",
        "hi": "याद रखें: पैसे प्राप्त करने के लिए कभी भी यूपीआई पिन दर्ज करने या क्यूआर कोड स्कैन करने की आवश्यकता नहीं होती।"
    }
}
