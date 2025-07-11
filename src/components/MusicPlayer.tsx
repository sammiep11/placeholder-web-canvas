
import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

const defaultPlaylist = [
  {
    id: 1,
    title: "In Da Club",
    artist: "50 Cent",
    src: "https://sammiep11.github.io/placeholder-web-canvas/In-Da-Club.mp3"
  },
  {
    id: 2,
    title: "Throwback Party",
    artist: "2000s Classics",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Classic 2000s",
    artist: "Millennium Hits",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState(defaultPlaylist);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showAutoplayHint, setShowAutoplayHint] = useState(true);
  const audioRef = useRef(null);

  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      // Removed autoplay - no longer automatically playing when song changes
    }
    setCurrentTime(0);
  }, [currentSongIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Auto-play after first user interaction
  useEffect(() => {
    if (userInteracted) return;

    const handleFirstInteraction = () => {
      setUserInteracted(true);
      setShowAutoplayHint(false);
      
      // Start music after a brief delay
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio && !isPlaying) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                toast({
                  title: "🎵 Music Started",
                  description: "Welcome to the party! Music is now playing.",
                  duration: 3000
                });
              })
              .catch((error) => {
                console.error("Auto-play failed:", error);
                toast({
                  title: "Click Play to Start Music",
                  description: "Your browser prevented auto-play.",
                  variant: "destructive"
                });
              });
          }
        }
      }, 500);
    };

    // Listen for various user interactions
    const events = ['click', 'touchstart', 'scroll', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [userInteracted, isPlaying]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Playback Error:", error);
            toast({
              title: "Playback Error",
              description: "Click play again or interact with the page.",
              variant: "destructive"
            });
          });
      }
    }
  };

  const handlePrevious = () => {
    setCurrentSongIndex(prev => (prev === 0 ? playlist.length - 1 : prev - 1));
    setIsPlaying(false); // Changed to not auto-play when switching songs
  };

  const handleNext = () => {
    setCurrentSongIndex(prev => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(false); // Changed to not auto-play when switching songs
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) setIsMuted(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="spacehey-panel w-full">
      <div className="spacehey-panel-header">Now Playing</div>
      <div className="p-2">
        {showAutoplayHint && (
          <div className="text-xs text-center mb-2 p-2 bg-blue-100 border border-blue-300 rounded animate-pulse">
            🎵 Music will start automatically once you interact with the page!
          </div>
        )}

        <div className="bg-[#EFEFEF] border border-gray-400">
          <div className="flex items-center justify-around my-2 bg-gray-700 text-white p-1 border border-black">
            <button onClick={handlePrevious}><SkipBack size={16} /></button>
            <button onClick={togglePlayPause}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button onClick={handleNext}><SkipForward size={16} /></button>
            <div className="text-xs ml-2 max-w-[150px]">
              <div>{currentSong?.title}</div>
              <div>{currentSong?.artist}</div>
              <div className="text-[10px] mt-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2 p-2">
            <button onClick={toggleMute}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <Slider
              defaultValue={[volume]}
              max={100}
              step={1}
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="metadata"
        src={currentSong?.src}
        onTimeUpdate={() => {
          const audio = audioRef.current;
          if (audio) setCurrentTime(audio.currentTime);
        }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)} // Modified to not automatically play next song
      />
    </div>
  );
};

export default MusicPlayer;
