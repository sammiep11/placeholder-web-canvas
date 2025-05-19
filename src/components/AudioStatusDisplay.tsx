
import React from 'react';
import { Loader } from 'lucide-react';
import { getFormatDisplayName } from '../utils/audioUtils';

interface AudioStatusDisplayProps {
  isLoading: boolean;
  error: string | null;
  currentFormat: string | null;
  debugInfo?: string | null;
}

const AudioStatusDisplay = ({ isLoading, error, currentFormat, debugInfo }: AudioStatusDisplayProps) => {
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
      <div className="flex flex-col gap-1">
        <div className="text-xs text-red-500 py-1">
          {error}
        </div>
        <div className="text-xs text-gray-500">
          Please ensure audio files exist in the public folder.
        </div>
        {debugInfo && (
          <div className="text-xs text-blue-500 mt-1 p-1 bg-blue-50 rounded">
            Debug: {debugInfo}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="text-xs text-gray-500">
      {currentFormat ? `Playing ${getFormatDisplayName(currentFormat)}` : 'Ready'}
      {debugInfo && (
        <div className="text-xs text-blue-500 mt-1 p-1 bg-blue-50 rounded">
          Debug: {debugInfo}
        </div>
      )}
    </div>
  );
};

export default AudioStatusDisplay;
