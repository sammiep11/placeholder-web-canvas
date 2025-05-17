
import React, { useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AudioControls from './AudioControls';
import AudioStatusDisplay from './AudioStatusDisplay';

const MusicPlayer = () => {
  const [songTitle] = useState('"In Da Club" - 50 Cent');
  
  // Include AAC format which is widely supported
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
      { src: '/party-song.mp3', type: 'audio/mpeg' },
      { src: '/party-song.m4a', type: 'audio/mp4' },  // AAC format
      { src: '/party-song.ogg', type: 'audio/ogg' },
      { src: '/party-song.wav', type: 'audio/wav' }
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
