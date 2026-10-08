from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Evidence(BaseModel):
    code: str
    category: str
    matched_text: str
    start: int
    end: int
    weight: float
    description: Optional[str] = None

class ScanRequest(BaseModel):
    text: str
    consent_to_store: bool = False

class UpiScanRequest(BaseModel):
    requester: str
    upi_id: str
    amount: str
    type: str # 'Pay' or 'Collect'
    note: Optional[str] = None
    deadline: Optional[str] = None
    consent_to_store: bool = False

class SignalStrength(BaseModel):
    category: str
    level: str # 'Low', 'Medium', 'High'
    score: float

class ScanResponse(BaseModel):
    id: str
    status: str # 'SAFE', 'SUSPICIOUS', 'SCAM'
    risk_level: str # 'Low', 'Medium', 'High'
    detected_language: str # 'en', 'kn', 'hi', 'mixed'
    evidence: List[Evidence]
    signals: List[SignalStrength] = []
    recommended_action_codes: List[str]
    limitations: Optional[str] = "Rules-based heuristic analysis. Verification with official authorities is always recommended."
    analysis_method: str = "transparent_rules_v1"
    original_text: Optional[str] = None

class ImageScanResponse(BaseModel):
    extracted_text: str
    confidence: Optional[float] = None
    engine_used: str
    status: str # 'success', 'warning', 'failed'
    message: Optional[str] = None

class LearnTopic(BaseModel):
    id: str
    slug: str
    category: str
    title: Dict[str, str]
    summary: Dict[str, str]
    example: Dict[str, str]
    danger: Dict[str, str]
    warning_signs: List[Dict[str, str]]
    safe_actions: List[Dict[str, str]]
