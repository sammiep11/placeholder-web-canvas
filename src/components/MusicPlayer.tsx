import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

// Sample playlist with some 2000s songs - can be replaced with user uploads
const defaultPlaylist = [
  {
    id: 1,
    title: "2000s Birthday Mix",
    artist: "Various Artists",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
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
  const [autoPlay, setAutoPlay] = useState(true);
  const [playlist, setPlaylist] = useState(defaultPlaylist);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    // Create audio element
    const audio = new Audio(currentSong?.src || '');
    audioRef.current = audio;
    
    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('ended', handleNext);
    
    // Clean up
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audio.removeEventListener('ended', handleNext);
      audio.pause();
    };
  }, [currentSongIndex, playlist]);

  useEffect(() => {
    // Apply volume settings
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (!currentSong) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    } else {
      audioRef.current?.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback Error",
          description: "There was a problem playing this track.",
          variant: "destructive"
        });
      });
      animationRef.current = requestAnimationFrame(updateProgress);
    }
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handlePrevious = () => {
    if (playlist.length === 0) return;
    setCurrentSongIndex(prev => (prev === 0 ? playlist.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    setCurrentSongIndex(prev => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) setIsMuted(false);
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Process uploaded files
    const newSongs = Array.from(files).map((file, index) => {
      // Create object URL for the audio file
      const songUrl = URL.createObjectURL(file);
      
      // Extract filename without extension for title
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      return {
        id: Date.now() + index,
        title: fileName,
        artist: "Your Upload",
        src: songUrl
      };
    });
    
    // Add to playlist
    setPlaylist(prev => [...prev, ...newSongs]);
    
    // Show success message
    toast({
      title: "Songs Added",
      description: `Added ${newSongs.length} song${newSongs.length > 1 ? 's' : ''} to your playlist.`
    });
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeSong = (songId: number) => {
    // If removing current song, adjust
    const isCurrent = playlist[currentSongIndex].id === songId;
    
    // Filter out the song
    setPlaylist(prev => prev.filter(song => song.id !== songId));
    
    // Adjust currentSongIndex if needed
    if (isCurrent) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
      setCurrentSongIndex(0);
    } else if (currentSongIndex >= playlist.length - 1) {
      setCurrentSongIndex(Math.max(0, playlist.length - 2));
    }

    toast({
      description: "Song removed from playlist"
    });
  };

  return (
    <div className="myspace-box">
      <div className="myspace-header flex justify-between items-center">
        <h3 className="text-sm">Music Player</h3>
        <div className="flex gap-2">
          <button 
            className="text-xs cursor-pointer hover:underline"
            onClick={() => setShowPlaylist(!showPlaylist)}
          >
            {showPlaylist ? "Hide Playlist" : "Show Playlist"}
          </button>
          <button 
            className="text-xs cursor-pointer hover:underline"
            onClick={toggleAutoPlay}
          >
            Auto Play: {autoPlay ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
      <div className="p-2 bg-[#EFEFEF] border border-gray-400 mt-2">
        {/* Player controls */}
        <div className="flex items-center justify-around my-2 bg-gray-700 text-white p-1 border border-black">
          <button 
            className="px-2 hover:bg-gray-600"
            onClick={handlePrevious}
            aria-label="Previous song"
          >
            <SkipBack size={16} />
          </button>
          <button 
            className="px-2 hover:bg-gray-600"
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button 
            className="px-2 hover:bg-gray-600"
            onClick={handleNext}
            aria-label="Next song"
          >
            <SkipForward size={16} />
          </button>
          <div className="text-xs ml-2 flex-grow max-w-[150px]">
            <div className="truncate">{currentSong?.title || "No song selected"}</div>
            <div className="truncate">{currentSong?.artist || ""}</div>
            <div className="text-[10px] mt-1">
              {playlist.length > 0 ? 
                `Track ${currentSongIndex + 1} of ${playlist.length} • ${formatTime(currentTime)} / ${formatTime(duration)}` :
                "No songs in playlist"
              }
            </div>
          </div>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center space-x-2 mt-2">
          <button 
            className="text-gray-800 hover:text-gray-600"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="w-full">
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
        
        {/* Upload button */}
        <div className="mt-3 flex justify-center">
          <Button 
            onClick={triggerFileInput}
            variant="outline" 
            size="sm"
            className="text-xs flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-600"
          >
            <Upload size={14} />
            Add Your Songs
          </Button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="audio/*" 
            multiple 
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        
        {/* Playlist view */}
        {showPlaylist && (
          <div className="mt-3 border border-gray-300 bg-white p-2 max-h-40 overflow-y-auto text-xs">
            <p className="font-bold mb-1">Your Playlist:</p>
            {playlist.length === 0 ? (
              <p className="text-gray-500 italic">No songs in playlist</p>
            ) : (
              <ul>
                {playlist.map((song, index) => (
                  <li key={song.id} className={`flex justify-between items-center p-1 ${currentSongIndex === index ? 'bg-blue-100' : ''}`}>
                    <div 
                      className="cursor-pointer truncate flex-1"
                      onClick={() => {
                        setCurrentSongIndex(index);
                        setIsPlaying(true);
                      }}
                    >
                      {index + 1}. {song.title} - {song.artist}
                    </div>
                    <button
                      onClick={() => removeSong(song.id)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
      {/* Hidden audio element */}
      <audio 
        ref={audioRef}
        src={currentSong?.src}
        autoPlay={autoPlay && isPlaying}
        onEnded={handleNext}
        onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
        className="hidden"
      />
    </div>
  );
};

export default MusicPlayer;


