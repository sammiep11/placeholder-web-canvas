
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { useToast } from '../hooks/use-toast';
import { Alert, AlertDescription } from './ui/alert';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentFormat, setCurrentFormat] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Toggle play/pause
  const togglePlayPause = () => {
    console.log("Play/Pause button clicked");
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playback started successfully');
            })
            .catch(err => {
              console.error('Error playing audio:', err);
              toast({
                title: "Playback Error",
                description: "Could not play the audio. Try again.",
                variant: "destructive"
              });
            });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update progress bar
  const updateProgress = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((currentTime / duration) * 100);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  const handleSourceError = (e: React.SyntheticEvent<HTMLSourceElement>) => {
    console.log(`Source error for format: ${e.currentTarget.type}`);
    // We don't set the error here as we want to try all sources first
  };

  const handleAudioError = (e: Event) => {
    const audioElement = e.target as HTMLMediaElement;
    const error = audioElement.error;
    console.error("Audio loading error:", error);
    
    let errorMessage = "Failed to load audio";
    
    // More specific error messages based on error code
    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Audio playback was aborted";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Network error occurred while loading the audio";
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = "Audio file is corrupted or uses an unsupported format";
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = "None of the audio formats are supported by your browser";
          break;
        default:
          errorMessage = `Error loading audio: ${error.message || "unknown error"}`;
      }
    }
    
    setIsLoading(false);
    setLoadError(errorMessage);
    toast({
      title: "Audio Error",
      description: errorMessage,
      variant: "destructive"
    });
  };
  
  const handleLoadedData = () => {
    // Get the current source that successfully loaded
    if (audioRef.current) {
      const source = audioRef.current.querySelector('source[src="' + audioRef.current.currentSrc + '"]');
      if (source) {
        setCurrentFormat(source.getAttribute('type') || null);
        console.log("Successfully loaded format:", source.getAttribute('type'));
      }
    }
    setIsLoading(false);
    setLoadError(null);
  };

  // Set initial volume and add event listeners
  useEffect(() => {
    console.log("MusicPlayer component mounted");
    
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      
      // Audio loaded successfully
      const handleCanPlayThrough = () => {
        console.log("Audio can play through - loaded successfully");
        setIsLoading(false);
        setLoadError(null);
      };
      
      // Audio metadata loaded
      const handleLoadedMetadata = () => {
        console.log("Audio metadata loaded");
      };

      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('loadeddata', handleLoadedData);
      audioRef.current.addEventListener('error', handleAudioError);
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', () => {
        console.log("Audio playback ended");
        setIsPlaying(false);
        setProgress(0);
      });

      // Force reload the audio to ensure proper loading
      audioRef.current.load();

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('loadeddata', handleLoadedData);
          audioRef.current.removeEventListener('error', handleAudioError);
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('ended', () => {
            setIsPlaying(false);
            setProgress(0);
          });
        }
      };
    }
  }, []);

  return (
    <div className="spacehey-panel w-full mb-4">
      <div className="spacehey-panel-header">Party Playlist</div>
      <div className="p-2 space-y-3">
        <div className="font-bold text-xs">
          Now Playing: "In Da Club" - 50 Cent
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader className="h-4 w-4 text-blue-600 animate-spin mr-2" />
            <span className="text-xs">Loading audio...</span>
          </div>
        )}
        
        {loadError && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-xs">
              {loadError}
            </AlertDescription>
          </Alert>
        )}
        
        {currentFormat && !loadError && !isLoading && (
          <div className="text-xs text-green-600">
            Playing using {currentFormat.replace('audio/', '')} format
          </div>
        )}
        
        <audio ref={audioRef} preload="auto">
          <source src="/party-song.mp3" type="audio/mpeg" onError={handleSourceError} />
          <source src="/party-song.ogg" type="audio/ogg" onError={handleSourceError} />
          <source src="/party-song.wav" type="audio/wav" onError={handleSourceError} />
          Your browser does not support the audio element.
        </audio>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={togglePlayPause} 
            variant="outline" 
            size="icon"
            className="h-8 w-8 rounded-full border-blue-300"
            disabled={isLoading || !!loadError}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-blue-600" />
            ) : (
              <Play className="h-4 w-4 text-blue-600" />
            )}
          </Button>
          
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>
        
        <div className="text-xs text-gray-500 mt-1">
          This player supports MP3, OGG, and WAV formats and will automatically use the first format that your browser supports.
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
