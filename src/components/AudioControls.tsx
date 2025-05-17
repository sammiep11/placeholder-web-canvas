
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
    <div className="flex items-center gap-2">
      <Button 
        onClick={onTogglePlayPause} 
        variant="outline" 
        size="icon"
        className="h-8 w-8 rounded-sm border-blue-300 bg-blue-100 hover:bg-blue-200"
        disabled={isDisabled}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-blue-600" />
        ) : (
          <Play className="h-4 w-4 text-blue-600" />
        )}
      </Button>
      
      <div className="flex-1">
        <Progress value={progress} className="h-1.5 bg-gray-200" />
      </div>
    </div>
  );
};

export default AudioControls;
