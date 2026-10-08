import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useSpeechSynthesis() {
  const { i18n } = useTranslation();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [missingVoiceAlert, setMissingVoiceAlert] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getVoiceForLanguage = (lang: string) => {
    // Map i18n codes to SpeechSynthesis locales
    let targetLang = 'en-IN';
    if (lang === 'hi') targetLang = 'hi-IN';
    if (lang === 'kn') targetLang = 'kn-IN';

    // Try to find exact match
    let voice = voices.find(v => v.lang.startsWith(targetLang));
    
    // Fallback: If not found, check if it's hi or kn and alert
    if (!voice && (lang === 'hi' || lang === 'kn')) {
      return null;
    }
    
    // Default fallback to any english if nothing else
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('en'));
    }
    
    return voice;
  };

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setMissingVoiceAlert(null);

    const voice = getVoiceForLanguage(i18n.language);
    
    if (!voice && (i18n.language === 'kn' || i18n.language === 'hi')) {
      const langName = i18n.language === 'kn' ? 'Kannada' : 'Hindi';
      setMissingVoiceAlert(`Your device does not have a ${langName} voice installed. Please install it in your OS settings to hear this text.`);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    
    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); };
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); };
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); };

    window.speechSynthesis.speak(utterance);
  }, [voices, i18n.language, rate]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    rate,
    setRate,
    missingVoiceAlert
  };
}
