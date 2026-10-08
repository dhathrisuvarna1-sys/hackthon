from typing import List, Dict, Any

from app.rules.urgency import check_urgency
from app.rules.kyc import check_kyc
from app.rules.credentials import check_credentials
from app.rules.links import check_links
from app.rules.lottery import check_lottery
from app.rules.refund import check_refund
from app.rules.impersonation import check_impersonation
from app.rules.payment_pressure import check_payment_pressure
from app.rules.remote_access import check_remote_access
from app.rules.upi_collect import check_upi_collect_context

def run_all_text_rules(text: str) -> List[Dict[str, Any]]:
    all_evidence = []
    all_evidence.extend(check_urgency(text))
    all_evidence.extend(check_kyc(text))
    all_evidence.extend(check_credentials(text))
    all_evidence.extend(check_links(text))
    all_evidence.extend(check_lottery(text))
    all_evidence.extend(check_refund(text))
    all_evidence.extend(check_impersonation(text))
    all_evidence.extend(check_payment_pressure(text))
    all_evidence.extend(check_remote_access(text))
    return all_evidence
