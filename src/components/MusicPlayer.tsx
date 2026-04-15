import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'AI Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Digital Core',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400',
  },
  {
    id: '3',
    title: 'Midnight Drive',
    artist: 'Retro Wave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current && typeof volume[0] === 'number' && isFinite(volume[0])) {
      const newVolume = Math.min(1, Math.max(0, volume[0] / 100));
      audioRef.current.volume = newVolume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkip = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    }
    setProgress(0);
    setCurrentTime(0);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      if (dur > 0 && isFinite(dur)) {
        setProgress((current / dur) * 100);
      } else {
        setProgress(0);
      }
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[400px] bg-black brutal-border p-6 flex flex-col gap-6">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate}
        onEnded={() => handleSkip('next')}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 flex-shrink-0 brutal-border border-2 overflow-hidden">
          <motion.div 
            animate={isPlaying ? { 
              x: [0, -2, 2, -2, 0],
              filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(0deg)']
            } : {}}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="w-full h-full"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale contrast-150"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-xl font-heading text-glitch-magenta truncate glitch-text text-[12px]" data-text={currentTrack.title}>{currentTrack.title}</h3>
          <p className="text-glitch-cyan text-[10px] font-mono uppercase tracking-wider">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2 bg-glitch-cyan/10 rounded-none border border-glitch-cyan/30" />
        <div className="flex justify-between text-[8px] font-mono text-glitch-cyan">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 0)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleSkip('prev')}
          className="text-glitch-cyan hover:text-glitch-magenta hover:bg-transparent"
        >
          <SkipBack className="w-6 h-6" />
        </Button>

        <Button 
          onClick={togglePlay}
          className="w-16 h-16 rounded-none bg-glitch-magenta hover:bg-glitch-yellow text-black brutal-border p-0"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleSkip('next')}
          className="text-glitch-cyan hover:text-glitch-magenta hover:bg-transparent"
        >
          <SkipForward className="w-6 h-6" />
        </Button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-4 px-2">
        <Volume2 className="w-4 h-4 text-glitch-cyan" />
        <Slider 
          value={volume} 
          onValueChange={setVolume} 
          max={100} 
          step={1} 
          className="flex-1"
        />
      </div>

      {/* Visualizer Mock */}
      <div className="flex items-end justify-between h-12 px-2 gap-1 border-t border-glitch-cyan/20 pt-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div 
            key={i}
            animate={isPlaying ? { 
              height: [
                Math.random() * 100 + '%', 
                Math.random() * 100 + '%', 
                Math.random() * 100 + '%'
              ],
              backgroundColor: i % 2 === 0 ? '#00ffff' : '#ff00ff'
            } : { height: '10%', backgroundColor: '#1a1a1a' }}
            transition={{ repeat: Infinity, duration: 0.2 + Math.random() * 0.3 }}
            className="w-full rounded-none"
          />
        ))}
      </div>
    </div>
  );
};
