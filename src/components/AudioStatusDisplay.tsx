
import React from 'react';
import { Loader } from 'lucide-react';
import { getFormatDisplayName } from '../utils/audioUtils';

interface AudioStatusDisplayProps {
  isLoading: boolean;
  error: string | null;
  currentFormat: string | null;
}

const AudioStatusDisplay = ({ isLoading, error, currentFormat }: AudioStatusDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-start py-1">
        <Loader className="h-3 w-3 text-blue-600 animate-spin mr-2" />
        <span className="text-xs text-gray-500">Loading audio...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-xs text-red-500 py-1">
        {error}
      </div>
    );
  }
  
  if (currentFormat) {
    return (
      <div className="text-xs text-gray-500">
        Playing {getFormatDisplayName(currentFormat)}
      </div>
    );
  }
  
  return null;
};

export default AudioStatusDisplay;
