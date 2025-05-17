
import React from 'react';
import { Volume2 } from 'lucide-react';
import { Slider } from './ui/slider';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  return (
    <div className="flex items-center gap-2">
      <Volume2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
      <Slider
        value={[volume]}
        min={0}
        max={100}
        step={1}
        onValueChange={onVolumeChange}
        className="flex-1"
      />
    </div>
  );
};

export default VolumeControl;
