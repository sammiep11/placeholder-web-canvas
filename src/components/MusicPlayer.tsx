
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
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
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, []);

  return (
    <div className="spacehey-panel w-full mb-4">
      <div className="spacehey-panel-header">Party Playlist</div>
      <div className="p-2 space-y-3">
        <div className="font-bold text-xs">
          Now Playing: "Best Day Ever" - Party Mix
        </div>
        <audio 
          ref={audioRef} 
          src="/party-song.mp3"
          preload="metadata"
        />
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={togglePlayPause} 
            variant="outline" 
            size="icon"
            className="h-8 w-8 rounded-full border-blue-300"
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
          Note: Upload your MP3 as "party-song.mp3" in the public folder
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
