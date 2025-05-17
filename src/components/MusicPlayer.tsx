
import React from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AudioControls from './AudioControls';
import AudioStatusDisplay from './AudioStatusDisplay';
import { SUPPORTED_FORMATS } from '../utils/audioUtils';

const MusicPlayer = () => {
  const { 
    audioRef, 
    isPlaying, 
    progress, 
    isLoading, 
    loadError, 
    currentFormat,
    togglePlayPause, 
    handleSourceError
  } = useAudioPlayer();

  return (
    <div className="spacehey-panel w-full mb-4">
      <div className="spacehey-panel-header">Now Playing</div>
      <div className="p-2 space-y-2">
        <div className="font-bold text-sm">
          "In Da Club" - 50 Cent
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
        
        <audio ref={audioRef} preload="auto">
          {SUPPORTED_FORMATS.map(format => (
            <source 
              key={format.type}
              src={`/party-song.${format.extension}`} 
              type={format.type} 
              onError={handleSourceError} 
            />
          ))}
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default MusicPlayer;
