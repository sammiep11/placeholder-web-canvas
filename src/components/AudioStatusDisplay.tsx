
import React from 'react';
import { Loader } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface AudioStatusDisplayProps {
  isLoading: boolean;
  error: string | null;
  currentFormat: string | null;
}

const AudioStatusDisplay = ({ isLoading, error, currentFormat }: AudioStatusDisplayProps) => {
  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <Loader className="h-4 w-4 text-blue-600 animate-spin mr-2" />
          <span className="text-xs">Loading audio...</span>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {currentFormat && !error && !isLoading && (
        <div className="text-xs text-green-600">
          Playing using {currentFormat.replace('audio/', '')} format
        </div>
      )}
    </>
  );
};

export default AudioStatusDisplay;
