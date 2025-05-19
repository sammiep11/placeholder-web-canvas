
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || sources.length === 0) {
      setLoadError("Audio element not available or no source provided");
      setIsLoading(false);
      return;
    }

    // Reset and load
    audio.pause();
    audio.src = '';
    audio.removeAttribute('src');

    setIsLoading(true);
    setLoadError(null);
    setProgress(0);

    audio.src = sources[0].src + "?t=" + new Date().getTime();
    audio.crossOrigin = "anonymous";
    audio.preload = "auto";

    audio.oncanplaythrough = () => {
      setIsLoading(false);
      setCurrentFormat(sources[0].type);
    };

    audio.onerror = () => {
      const error = audio.error;
      const errorMsg = error ? formatErrorMessage(error) : "Failed to load audio";
      setLoadError(errorMsg);
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

    audio.load();

    // Optional fetch check for debug logging
    fetch(sources[0].src)
      .then(response => {
        if (!response.ok) throw new Error(`Status ${response.status}`);
        return response.blob();
      })
      .then(blob => {
        if (blob.size < 100) console.warn("Audio file might be empty");
      })
      .catch(err => {
        console.error("Error fetching audio file:", err);
        setLoadError(`Audio file not accessible: ${err.message}`);
        setIsLoading(false);
      });

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeAttribute('src');
    };
  }, [sources]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("Audio ref not attached");
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(err => {
            console.error("Playback error:", err);
            if (err.name === "NotAllowedError") {
              toast({
                title: "Autoplay Blocked",
                description: "Click play to start the music.",
                variant: "destructive"
              });
            } else {
              toast({
                title: "Playback Error",
                description: `Couldn't play ${songTitle}.`,
                variant: "destructive"
              });
            }
          });
      }
    }
  };

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
