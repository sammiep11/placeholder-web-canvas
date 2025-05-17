
import { useState, useRef, useEffect } from 'react';
import { useToast } from './use-toast';

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
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Create audio element programmatically
  useEffect(() => {
    console.log("Creating audio element programmatically");
    // Create audio element
    const audio = new Audio();
    audioRef.current = audio;
    
    // Set up initial source
    tryLoadSource(currentSourceIndex);

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.removeAttribute('src');
      }
    };
  }, []);

  const tryLoadSource = (sourceIndex: number) => {
    if (sourceIndex >= sources.length) {
      console.error("All audio sources failed");
      setLoadError("No supported audio format found");
      setIsLoading(false);
      return;
    }

    if (!audioRef.current) return;

    const source = sources[sourceIndex];
    console.log(`Trying to load source: ${source.src} (${source.type})`);
    
    // Clear previous handlers to avoid duplicates
    const audio = audioRef.current;
    audio.oncanplay = null;
    audio.oncanplaythrough = null;
    audio.onloadeddata = null;
    audio.onloadedmetadata = null;
    audio.onerror = null;
    audio.ontimeupdate = null;
    audio.onended = null;
    
    // Set up new handlers
    audio.oncanplaythrough = () => {
      console.log(`Source loaded successfully: ${source.src} (${source.type})`);
      setIsLoading(false);
      setLoadError(null);
      setCurrentFormat(source.type);
    };
    
    audio.onerror = () => {
      console.error(`Error loading source: ${source.src} (${source.type})`);
      console.log(`Trying next source, index: ${sourceIndex + 1}`);
      
      // Try next source
      setCurrentSourceIndex(prevIndex => prevIndex + 1);
      tryLoadSource(sourceIndex + 1);
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
    audio.src = source.src;
    audio.load();
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    console.log("Play/Pause button clicked");
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      console.log("Attempting to play audio...");
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playback started successfully');
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
