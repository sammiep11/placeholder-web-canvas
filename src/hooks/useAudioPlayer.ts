
import { useState, useRef, useEffect } from 'react';
import { useToast } from './use-toast';
import { formatErrorMessage } from '../utils/audioUtils';

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
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
        setIsPlaying(false);
      } else {
        console.log("Attempting to play audio...");
        // Force reload before playing
        try {
          audioRef.current.load();
          
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Audio playback started successfully');
                setIsPlaying(true);
              })
              .catch(err => {
                console.error('Error playing audio:', err);
                // Check if this is an autoplay policy issue
                if (err.name === "NotAllowedError") {
                  toast({
                    title: "Autoplay Blocked",
                    description: "Browser requires user interaction to play audio. Click play again.",
                    variant: "destructive"
                  });
                } else {
                  toast({
                    title: "Playback Error",
                    description: "Could not play the audio. Try again.",
                    variant: "destructive"
                  });
                }
              });
          }
        } catch (err) {
          console.error("Error attempting to play:", err);
        }
      }
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

  const handleSourceError = (e: React.SyntheticEvent<HTMLSourceElement>) => {
    const sourceElement = e.currentTarget;
    console.log(`Source error for format: ${sourceElement.type}`);
    console.log(`Attempted to load: ${sourceElement.src}`);
    
    // Check if file exists with fetch again directly
    const absoluteUrl = new URL(sourceElement.src, window.location.origin).href;
    console.log(`Checking absolute URL: ${absoluteUrl}`);
    
    fetch(absoluteUrl, { method: 'HEAD' })
      .then(response => {
        console.log(`HEAD request for ${absoluteUrl}: status ${response.status}`);
        if (response.ok) {
          console.log("File exists but audio element can't play it");
          setLoadError("File exists but can't be played. Check CORS or file format.");
        }
      })
      .catch(err => {
        console.error(`Fetch error for ${absoluteUrl}:`, err);
      });
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
    console.log("Audio data loaded successfully");
    // Get the current source that successfully loaded
    if (audioRef.current) {
      setCurrentFormat("audio/mpeg");
      console.log("Source URL that worked:", audioRef.current.currentSrc);
    }
    setIsLoading(false);
    setLoadError(null);
  };

  // Add event listeners
  useEffect(() => {
    console.log("MusicPlayer component mounted");
    
    if (audioRef.current) {
      const audio = audioRef.current;
      
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

      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('error', handleAudioError);
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', () => {
        console.log("Audio playback ended");
        setIsPlaying(false);
        setProgress(0);
      });

      // Force reload the audio to ensure proper loading
      console.log("Force reloading audio element");
      try {
        audio.load();
      } catch (err) {
        console.error("Error loading audio:", err);
      }

      return () => {
        // Clean up event listeners
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('error', handleAudioError);
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', () => {
          setIsPlaying(false);
          setProgress(0);
        });
      };
    }
  }, []);

  return {
    audioRef,
    isPlaying,
    progress,
    isLoading,
    loadError,
    currentFormat,
    togglePlayPause,
    handleSourceError
  };
}
