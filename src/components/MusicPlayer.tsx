
import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AudioControls from './AudioControls';
import AudioStatusDisplay from './AudioStatusDisplay';

const MusicPlayer = () => {
  const [songTitle] = useState('Test Audio');
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  // Use only the test audio file to simplify debugging
  const { 
    audioRef, 
    isPlaying, 
    progress, 
    isLoading, 
    loadError, 
    currentFormat,
    togglePlayPause
  } = useAudioPlayer({
    sources: [
      { src: '/test-audio.wav', type: 'audio/wav' }
    ],
    songTitle
  });
  
  // Display debug info in development
  useEffect(() => {
    const checkFileExists = async () => {
      try {
        const response = await fetch('/test-audio.wav', { method: 'HEAD' });
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
  }, []);
  
  return (
    <div className="spacehey-panel w-full mb-4">
      <div className="spacehey-panel-header">Now Playing</div>
      <div className="p-2 space-y-2">
        <div className="font-bold text-sm">
          {songTitle}
        </div>
        
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
