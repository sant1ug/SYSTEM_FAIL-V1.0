import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Music, Gamepad2, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center bg-background p-4 md:p-8">
      {/* Glitch Overlays */}
      <div className="static-noise" />
      <div className="scanline" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-glitch-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-glitch-magenta/5 blur-[120px] rounded-full" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{ 
            backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} 
        />
      </div>

      {/* Header */}
      <header className="relative z-10 mb-12 text-center">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center justify-center gap-2 mb-2"
        >
          <Zap className="w-12 h-12 text-glitch-yellow animate-pulse mb-4" />
          <h1 
            className="text-4xl md:text-6xl font-heading glitch-text text-white uppercase tracking-tighter"
            data-text="SYSTEM_FAILURE"
          >
            SYSTEM_FAILURE
          </h1>
        </motion.div>
        <p className="text-glitch-magenta font-mono text-xs uppercase tracking-[0.5em] animate-pulse">
          [!] UNAUTHORIZED_ACCESS_DETECTED // PROTOCOL_SNAKE_ACTIVE
        </p>
      </header>

      <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column - Terminal Output */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <div className="brutal-border bg-black p-6 space-y-4">
            <div className="flex items-center gap-2 text-glitch-cyan">
              <Terminal className="w-5 h-5" />
              <h2 className="font-heading text-[10px] uppercase tracking-wider">LOG_STREAM</h2>
            </div>
            <div className="text-[10px] font-mono text-glitch-cyan/60 space-y-1 overflow-hidden h-32">
              <p className="animate-pulse">{">"} INITIALIZING_GRID...</p>
              <p>{">"} LOADING_NEURAL_BEATS...</p>
              <p className="text-glitch-magenta">{">"} WARNING: BUFFER_OVERFLOW</p>
              <p>{">"} BYPASSING_SECURITY...</p>
              <p>{">"} SNAKE_CORE_LOADED</p>
              <p className="animate-bounce">{">"} _</p>
            </div>
          </div>

          <div className="brutal-border bg-black p-6 space-y-4">
            <div className="flex items-center gap-2 text-glitch-magenta">
              <Activity className="w-5 h-5" />
              <h2 className="font-heading text-[10px] uppercase tracking-wider">BIO_SYNC</h2>
            </div>
            <p className="text-[10px] font-mono text-glitch-magenta/60 leading-relaxed uppercase">
              FEED_THE_VOID. GROW_THE_MACHINE. DO_NOT_COLLIDE_WITH_SELF.
            </p>
          </div>
        </div>

        {/* Center Column - Game */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Column - Music Player */}
        <div className="lg:col-span-3 flex justify-center lg:justify-end">
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <MusicPlayer />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 text-center text-[8px] font-mono text-glitch-cyan uppercase tracking-[0.8em] opacity-30">
        [REDACTED] // NO_FUTURE_FOUND // 01010111 01001000 01011001
      </footer>
    </div>
  );
}

import { Activity, Terminal } from 'lucide-react';
