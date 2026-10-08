# Evaluation and Accuracy

Suraksha Shield's Fraud Detection Engine is a transparent, heuristic rules-based evaluator. Unlike opaque ML models, it scores inputs against clearly defined indicators, making it perfectly explainable.

## The 5-Layer Pipeline

1. **Normalization**: Removes Unicode obfuscation (NFKC) and extracts entities (URLs, emails, amounts, phone numbers).
2. **Indicator Rules Execution**: Scans for specific scam patterns with associated risk weights.
   - Urgency markers (Weight: +0.4)
   - Fake KYC (Weight: +0.8)
   - Lottery/Prize (Weight: +0.8)
   - Suspicious Links (Weight: +0.6)
   - Refund pressure (Weight: +0.7)
   - Remote access apps (Weight: +0.9)
   - OTP requests (Weight: +0.8)
3. **Signal Accumulation**: Aggregates triggered rules into a `total_weight` score.
4. **False Positive Prevention (Safety Overrides)**: Evaluates the text against safe patterns (e.g., standard bank alerts) and explicitly sets the score to `0` if a match is found.
5. **Decision Synthesis**:
   - `total_weight` >= 0.7 -> **SCAM**
   - `total_weight` >= 0.4 -> **SUSPICIOUS**
   - `total_weight` < 0.4 -> **SAFE**

## Scenarios Evaluated

The dataset (`datasets/samples/dataset.json`) evaluates:
1. English Fake KYC SMS (Expected: Scam)
2. Hindi Lottery SMS (Expected: Scam)
3. Normal Payment Alert (Expected: Safe)
4. Kannada OTP Theft Request (Expected: Scam)
5. Remote Access Scam (Expected: Scam)
6. Fake UPI Collect (Expected: Scam)

## Advantages

- **Explainability**: Every decision is tied directly to triggered rules (e.g., "Contains urgency marker" + "Fake KYC").
- **Speed**: Heuristics are evaluated in milliseconds, no GPU needed.
- **Vernacular Support**: Native strings are checked seamlessly without losing context in translation.
