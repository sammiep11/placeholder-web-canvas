
import { useState, useRef, useEffect } from 'react';
import { useToast } from './use-toast';
import { formatErrorMessage } from '../utils/audioUtils';

type AudioSource = {
  src: string;
  type: string;
};

type UseAudioPlayerProps = {
  sources: AudioSource[];
  songTitle: string;
};

export function useAudioPlayer({ sources, songTitle }: UseAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentFormat, setCurrentFormat] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Create audio element programmatically
  useEffect(() => {
    console.log("Creating audio element for test file");
    
    if (!sources || sources.length === 0) {
      console.error("No audio sources provided");
      setLoadError("No audio sources provided");
      setIsLoading(false);
      return;
    }

    // Cleanup existing audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.removeAttribute('src');
    }

    // Create audio element
    const audio = new Audio();
    audioRef.current = audio;
    
    // Set up handlers
    audio.oncanplaythrough = () => {
      console.log("Audio can play through without buffering");
      setIsLoading(false);
      setLoadError(null);
      setCurrentFormat(sources[0].type);
    };
    
    audio.onerror = (e) => {
      const error = audio.error;
      console.error("Error loading audio:", error);
      
      if (error) {
        const errorMsg = formatErrorMessage(error);
        console.error(`Media error code: ${error.code}, message: ${error.message || errorMsg}`);
        setLoadError(errorMsg);
      } else {
        setLoadError("Failed to load audio");
      }
      
      setIsLoading(false);
    };
    
    audio.ontimeupdate = () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration || 1;
      setProgress((currentTime / duration) * 100);
    };
    
    audio.onended = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    
    // Set source and attempt to load
    audio.src = sources[0].src;
    console.log(`Loading test audio from: ${sources[0].src}`);
    
    // Ensure CORS isn't an issue
    audio.crossOrigin = "anonymous";
    
    // Force preload
    audio.preload = "auto";
    
    // Attempt to load the audio file
    audio.load();

    // Make an additional check to see if the file exists
    fetch(sources[0].src)
      .then(response => {
        if (!response.ok) {
          throw new Error(`File not found or not accessible (${response.status})`);
        }
        return response;
      })
      .catch(err => {
        console.error("Error fetching audio file:", err);
        setLoadError(`Audio file not found or inaccessible: ${err.message}`);
        setIsLoading(false);
      });

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.removeAttribute('src');
      }
    };
  }, [sources]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) {
      console.error("Audio element not initialized");
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log("Audio paused");
    } else {
      const playPromise = audioRef.current.play();
      
      console.log("Attempting to play audio...");
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Audio playback started successfully");
            setIsPlaying(true);
          })
          .catch(err => {
            console.error('Error playing audio:', err);
            
            if (err.name === "NotAllowedError") {
              toast({
                title: "Autoplay Blocked",
                description: "Browser requires user interaction to play audio. Click play again.",
                variant: "destructive"
              });
            } else {
              toast({
                title: "Playback Error",
                description: `Could not play ${songTitle}. Try again.`,
                variant: "destructive"
              });
            }
          });
      }
    }
  };

  // Expose the API
  return {
    audioRef,
    isPlaying,
    progress,
    isLoading,
    loadError,
    currentFormat,
    togglePlayPause
  };
}
