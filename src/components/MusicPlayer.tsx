
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { useToast } from '../hooks/use-toast';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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
        setIsLoading(false);
      };
      
      // Audio error handling
      const handleError = (e: Event) => {
        const error = (e.target as HTMLMediaElement).error;
        console.error("Audio loading error:", error);
        setIsLoading(false);
        setLoadError(error?.message || "Failed to load audio");
        toast({
          title: "Audio Error",
          description: `Could not load the audio file: ${error?.message || "Unknown error"}`,
          variant: "destructive"
        });
      };

      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('error', handleError);
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
          audioRef.current.removeEventListener('error', handleError);
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
          <div className="text-xs text-red-500 py-1">
            {loadError}
          </div>
        )}
        
        <audio 
          ref={audioRef} 
          src="/party-song.mp3"
          preload="auto"
          crossOrigin="anonymous"
        />
        
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
          If audio doesn't load, try refreshing the page.
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
