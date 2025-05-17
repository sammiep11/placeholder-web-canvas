
import { useState, useRef, useEffect } from 'react';
import { useToast } from './use-toast';
import { formatErrorMessage } from '../utils/audioUtils';

export function useAudioPlayer() {
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
    
    const errorMessage = formatErrorMessage(error);
    
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

  return {
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
  };
}
