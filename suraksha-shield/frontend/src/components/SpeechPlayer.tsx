import React from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { Play, Pause, Square, AlertTriangle } from 'lucide-react';

export const AudioPlayerContext = React.createContext<ReturnType<typeof useSpeechSynthesis> | null>(null);

export function SpeechPlayer({ children }: { children: React.ReactNode }) {
  const speech = useSpeechSynthesis();

  return (
    <AudioPlayerContext.Provider value={speech}>
      {children}
      {/* Global Audio Bar */}
      {(speech.isSpeaking || speech.isPaused || speech.missingVoiceAlert) && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--color-navy)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 1000,
          minWidth: '300px',
          justifyContent: 'center'
        }} role="region" aria-live="polite" aria-label="Audio Controls">
          
          {speech.missingVoiceAlert ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F8B4B4', fontSize: '0.875rem' }}>
              <AlertTriangle size={16} />
              <span>{speech.missingVoiceAlert}</span>
              <button onClick={() => speech.stop()} style={{ color: 'white', marginLeft: '8px' }} aria-label="Close alert"><Square size={16}/></button>
            </div>
          ) : (
            <>
              {speech.isPaused ? (
                <button onClick={speech.resume} aria-label="Resume playing" style={{ color: 'white' }}>
                  <Play size={20} />
                </button>
              ) : (
                <button onClick={speech.pause} aria-label="Pause playing" style={{ color: 'white' }}>
                  <Pause size={20} />
                </button>
              )}
              
              <button onClick={speech.stop} aria-label="Stop playing" style={{ color: 'white' }}>
                <Square size={20} />
              </button>

              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }}></div>

              <select 
                value={speech.rate} 
                onChange={(e) => speech.setRate(Number(e.target.value))}
                style={{ background: 'transparent', color: 'white', border: 'none', outline: 'none', cursor: 'pointer' }}
                aria-label="Playback speed"
              >
                <option value={0.7} style={{ color: 'black' }}>0.7x</option>
                <option value={1} style={{ color: 'black' }}>1x</option>
                <option value={1.2} style={{ color: 'black' }}>1.2x</option>
              </select>

              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                {speech.isSpeaking && !speech.isPaused ? 'Reading...' : 'Paused'}
              </div>
            </>
          )}
        </div>
      )}
    </AudioPlayerContext.Provider>
  );
}
