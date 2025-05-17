
import React from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import AudioControls from './AudioControls';
import VolumeControl from './VolumeControl';
import AudioStatusDisplay from './AudioStatusDisplay';
import { SUPPORTED_FORMATS } from '../utils/audioUtils';

const MusicPlayer = () => {
  const { 
    audioRef, 
    isPlaying, 
    progress, 
    volume, 
    isLoading, 
    loadError, 
    currentFormat,
    togglePlayPause, 
    handleVolumeChange,
    handleSourceError
  } = useAudioPlayer();

  return (
    <div className="spacehey-panel w-full mb-4">
      <div className="spacehey-panel-header">Party Playlist</div>
      <div className="p-2 space-y-3">
        <div className="font-bold text-xs">
          Now Playing: "In Da Club" - 50 Cent
        </div>
        
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
        
        <AudioControls 
          isPlaying={isPlaying}
          isDisabled={isLoading || !!loadError}
          progress={progress}
          onTogglePlayPause={togglePlayPause}
        />
        
        <VolumeControl 
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
        
        <div className="text-xs text-gray-500 mt-1">
          This player supports MP3, OGG, and WAV formats and will automatically use the first format that your browser supports.
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
