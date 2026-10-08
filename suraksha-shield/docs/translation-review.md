# Translation Review Checklist

The following UI strings and audio scripts require review by native Kannada and Hindi speakers to ensure tone, accuracy, and natural phrasing.

## Global Tone Guidelines
1. **Authoritative but Reassuring:** The tone should sound like a helpful security expert, not an alarmist.
2. **Clarity over Literal Translation:** Translate the *intent* of the safety advice, rather than a word-for-word literal translation that might sound robotic.
3. **Audio Friendliness:** Ensure the `audio_scripts` do not contain complex punctuation or URLs that sound confusing when read aloud by TTS.

## Strings Needing Review

### Kannada (`kn.json`)
- `nav.scan`: ಸ್ಕ್ಯಾನ್ ಮಾಡಿ (Does this convey "Check" or "Analyze" naturally in the context of apps?)
- `home.hero_title`: ಸಂದೇಶವು ನಿಜವೇ ಎಂದು ಖಚಿತವಿಲ್ಲವೇ? (Is this the most natural way to say "Not sure if a message is real?")
- `results.status_scam`: ಸಂಭವನೀಯ ಹಗರಣ. ಮುಂದುವರಿಯಬೇಡಿ. (Review for correct gravity of "Likely scam. Do not proceed.")
- `audio_scripts.safe`: ಯಾವುದೇ ಸ್ಪಷ್ಟ ಹಗರಣದ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ. (Ensure TTS engines pronounce this fluidly.)

### Hindi (`hi.json`)
- `nav.scan`: स्कैन करें (Standard, but confirm if 'जांचें' (Check) is better contextually.)
- `home.hero_title`: यकीन नहीं कि कोई संदेश असली है? (Review for natural conversational Hindi.)
- `results.status_scam`: संभावित घोटाला। आगे न बढ़ें। (Confirm the urgency is conveyed correctly.)
- `audio_scripts.safe`: घोटाले के कोई स्पष्ट संकेत नहीं मिले। (Ensure TTS pronunciation is accurate.)

## Next Steps
- Share this document with the localization team.
- Update `frontend/src/i18n/locales/kn.json` and `hi.json` with their feedback.
