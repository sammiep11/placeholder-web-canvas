
import React, { useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AudioControls from './AudioControls';
import AudioStatusDisplay from './AudioStatusDisplay';

const MusicPlayer = () => {
  const [songTitle] = useState('Test Audio');
  
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
      { src: '/test-audio.mp3', type: 'audio/mpeg' }
    ],
    songTitle
  });
  
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
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
