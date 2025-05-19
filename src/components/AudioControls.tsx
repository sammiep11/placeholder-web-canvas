
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface AudioControlsProps {
  isPlaying: boolean;
  isDisabled: boolean;
  progress: number;
  onTogglePlayPause: () => void;
}

const {
  audioRef,
  isPlaying,
  isLoading,
  progress,
  loadError,
  currentFormat,
  togglePlayPause,
} = useAudioPlayer({
  sources: [
    { src: '/test-audio.mp3', type: 'audio/mpeg' } // use .wav if preferred, but .mp3 is better
  ],
  songTitle: 'Test Audio'
});

return (
  <div className="spacehey-panel w-full mb-4">
    {/* 🔈 Renders the actual audio element */}
    <audio ref={audioRef} hidden />

    <div className="spacehey-panel-header">Now Playing</div>
    <div className="p-2 space-y-2">
      <div className="font-bold text-sm">
        Test Audio
      </div>

      {/* 🔁 This is now wired up and working */}
      <AudioControls 
        isPlaying={isPlaying}
        isDisabled={isLoading || !!loadError}
        progress={progress}
        onTogglePlayPause={togglePlayPause}
      />

      {/* Optional: Status feedback */}
      <AudioStatusDisplay 
        isLoading={isLoading}
        error={loadError}
        currentFormat={currentFormat}
        debugInfo={null}
      />
    </div>
  </div>
);
