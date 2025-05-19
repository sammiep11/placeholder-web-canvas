
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

const AudioControls = ({
  isPlaying,
  isDisabled,
  progress,
  onTogglePlayPause
}: AudioControlsProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={isDisabled}
          onClick={onTogglePlayPause}
          className="w-8 h-8 p-0"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default AudioControls;
