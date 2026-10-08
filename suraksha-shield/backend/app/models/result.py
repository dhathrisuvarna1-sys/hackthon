from sqlalchemy import Column, String, Text
from app.database.database import Base


class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(String, primary_key=True, index=True)
    status = Column(String)
    risk_level = Column(String)
    evidence_json = Column(Text)
    recommended_action_codes = Column(String)
    detected_language = Column(String)
    analysis_method = Column(String)
    original_text = Column(Text)