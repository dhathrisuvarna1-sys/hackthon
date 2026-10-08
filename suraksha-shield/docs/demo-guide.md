# Suraksha Shield: Demo Guide

This guide explains how to demonstrate Suraksha Shield to judges or stakeholders.

## 1. Introduction
"Suraksha Shield is a localized, accessibility-first web application designed to protect elderly and first-time digital users in India from vernacular scams, UPI fraud, and deceptive screenshots. It uses a transparent, explainable heuristic engine."

## 2. Key Features to Highlight
- **Dark Fintech Dashboard**: Professional, high-contrast UI with a strict lime accent. 
- **Accessibility & i18n**: Full support for English, Hindi, and Kannada. Try changing the language and demonstrating how the UI adapts flawlessly.
- **Audio Assistant**: Click the "Audio Assistant" button on any scan result page. It reads the scam breakdown aloud, crucial for users with low literacy.
- **Three-Pronged Protection**:
  1. **Message Scanner**: Scans raw text (SMS/WhatsApp).
  2. **Screenshot Scanner**: Extracts text from images via OCR and analyzes it.
  3. **UPI Scanner**: Checks "Collect Request" parameters for fraud patterns.

## 3. Demo Flow
1. **Home Page**: Show the hero section, the explanation of how it works, and the accessibility toggles (Language/Theme).
2. **Text Analysis**: 
   - Go to "Check Message".
   - Select the "Hindi Scam" example.
   - Click "Analyze".
   - The result page will show a **High Risk** warning with specific indicators (Urgency, Fake KYC) and recommend blocking the sender. Play the audio.
3. **Screenshot Analysis**: 
   - Go to "Scan Image".
   - Upload any fake lottery screenshot or use the fallback extract if OCR is still loading.
   - Analyze and review the output.
4. **UPI Collect Analysis**: 
   - Go to "Check UPI Request".
   - Leave the default "Collect" for Rs 5,000 from an unknown vendor.
   - Click "Analyze". Show the warnings about collect requests debiting money.
5. **Learn Section**: 
   - Go to the "Learn" page. Show the curated list of 8 scam types. Open one (e.g., Fake KYC) and show the detailed vernacular breakdown of the scam mechanism and safe actions.

## 4. Technical Selling Points
- **Zero Hallucination**: No generative AI is used for scoring; it relies on transparent rules.
- **Privacy First**: Analysis is local (or edge), and sensitive messages are discarded or masked unless explicitly consented to storage.
- **Performant**: Next-generation React frontend with a robust FastAPI backend.
