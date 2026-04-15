import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: INITIAL_DIRECTION,
    score: 0,
    isGameOver: false,
    isPaused: true,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
  });

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      score: 0,
      isGameOver: false,
      isPaused: false,
    }));
    directionRef.current = INITIAL_DIRECTION;
  };

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused) return prev;

      const head = prev.snake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        if (prev.score > prev.highScore) {
          localStorage.setItem('snakeHighScore', prev.score.toString());
        }
        return { ...prev, isGameOver: true, highScore: Math.max(prev.score, prev.highScore) };
      }

      const newSnake = [newHead, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Check food
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
      } else {
        newSnake.pop();
      }

      return { ...prev, snake: newSnake, food: newFood, score: newScore, direction: directionRef.current };
    });
  }, [generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': if (gameState.direction !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': case 's': if (gameState.direction !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': case 'a': if (gameState.direction !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': case 'd': if (gameState.direction !== 'LEFT') directionRef.current = 'RIGHT'; break;
        case ' ': 
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    if (!gameState.isPaused && !gameState.isGameOver) {
      const speed = Math.max(50, INITIAL_SPEED - Math.floor(gameState.score / 50) * 10);
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.isPaused, gameState.isGameOver, moveSnake, gameState.score]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] items-center px-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-glitch-magenta font-heading">DATA_POINTS</span>
          <span className="text-3xl font-bold font-mono text-glitch-cyan">{gameState.score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-glitch-magenta font-heading">PEAK_SYNC</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-glitch-yellow" />
            <span className="text-xl font-bold font-mono text-glitch-yellow">{gameState.highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group brutal-border p-1 bg-glitch-magenta/20">
        {/* Game Board */}
        <div 
          className="grid bg-black overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = gameState.snake[0].x === x && gameState.snake[0].y === y;
            const isSnakeBody = gameState.snake.slice(1).some(s => s.x === x && s.y === y);
            const isFood = gameState.food.x === x && gameState.food.y === y;

            return (
              <div key={i} className="relative w-full h-full border-[0.5px] border-glitch-cyan/10">
                {isSnakeHead && (
                  <motion.div 
                    layoutId="snake-head"
                    className="absolute inset-0 bg-glitch-cyan z-10"
                  />
                )}
                {isSnakeBody && (
                  <div className="absolute inset-0 bg-glitch-cyan/40" />
                )}
                {isFood && (
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.5, 1], 
                      backgroundColor: ['#ff00ff', '#ffff00', '#ff00ff'] 
                    }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="absolute inset-0 bg-glitch-magenta"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {(gameState.isPaused || gameState.isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20"
            >
              {gameState.isGameOver ? (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-heading text-glitch-magenta uppercase tracking-tighter glitch-text" data-text="CORE_CRASH">CORE_CRASH</h2>
                  <p className="text-glitch-cyan font-mono text-sm">RECOVERY_POINTS: {gameState.score}</p>
                  <Button 
                    onClick={resetGame}
                    className="bg-glitch-magenta hover:bg-glitch-yellow text-black font-heading text-xs px-8 py-6 rounded-none brutal-border"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> REBOOT_SYSTEM
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-heading text-glitch-cyan uppercase tracking-tighter glitch-text" data-text="HALT_STATE">HALT_STATE</h2>
                  <Button 
                    onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
                    className="bg-glitch-cyan hover:bg-glitch-yellow text-black font-heading text-xs px-8 py-6 rounded-none brutal-border"
                  >
                    <Play className="mr-2 h-4 w-4" /> RESUME_SYNC
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-[10px] font-mono text-glitch-cyan/40 uppercase tracking-widest">
        <span>INPUT: WASD_OR_ARROWS</span>
        <span>•</span>
        <span>BREAK: SPACE</span>
      </div>
    </div>
  );
};
