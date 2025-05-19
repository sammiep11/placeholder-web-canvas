import React, { useState, useEffect, useMemo } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AudioControls from './AudioControls';
import AudioStatusDisplay from './AudioStatusDisplay';

// Define the audio source outside the component to keep it stable
const sources = useMemo(() => [
  { src: '/test-audio.wav', type: 'audio/wav' }
], []);

const MusicPlayer = () => {
  const [songTitle] = useState('Test Audio');
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const {
    audioRef,
    isPlaying,
    progress,
    isLoading,
    loadError,
    currentFormat,
    togglePlayPause
  } = useAudioPlayer({
    sources: AUDIO_SOURCES,
    songTitle
  });

  // ✅ Debug check to confirm file exists (runs only once)
  useEffect(() => {
    const checkFileExists = async () => {
      try {
        const response = await fetch(AUDIO_SOURCES[0].src, { method: 'HEAD' });
        if (response.ok) {
          setDebugInfo(`File exists (status ${response.status})`);
        } else {
          setDebugInfo(`File not found (status ${response.status})`);
        }
      } catch (error) {
        setDebugInfo(`Error checking file: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    checkFileExists();
  }, []); // run only once

  return (
    <div className="spacehey-panel w-full mb-4">
      {/* ✅ The actual audio element connected to the player logic */}
      <audio ref={audioRef} hidden />

      <div className="spacehey-panel-header">Now Playing</div>
      <div className="p-2 space-y-2">
        <div className="font-bold text-sm">{songTitle}</div>

        <AudioControls
          isPlaying={isPlaying}
          isDisabled={isLoading || !!loadError}
          progress={progress}
          onTogglePlayPause={togglePlayPause}
        />

        <AudioStatusDisplay
          isLoading={isLoading}
          error={loadError}
          currentFormat={currentFormat}
          debugInfo={debugInfo}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;





