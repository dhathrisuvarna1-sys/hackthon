# Audio Assistant Support & Limitations

Suraksha Shield uses the native Web Speech API to provide seamless on-device voice synthesis and recognition without sending data to third parties.

## Browser Support
- **Chrome / Edge**: Full support for both Synthesis and Recognition.
- **Safari / iOS**: Synthesis supported. Recognition requires user permission per interaction.
- **Firefox**: Synthesis supported. Web Speech Recognition is heavily limited or unsupported by default. A fallback message will be shown to users.

## Language and Voice Limitations
- **English (`en-IN`)**: Widely supported across all modern devices.
- **Hindi (`hi-IN`)**: Available on most Android devices, Windows (if language pack is installed), and iOS.
- **Kannada (`kn-IN`)**: Highly dependent on the device's OS and installed language packs. If a Kannada voice is missing, the app will display a friendly prompt guiding the user to install it via their OS settings, and will refrain from reading Kannada text with an English voice to avoid confusion.

## Accuracy
Voice dictation (recognition) accuracy in vernacular languages (Hindi, Kannada) depends entirely on the device's built-in OS speech engine. Users are encouraged to review the dictated text before clicking "Analyze".
