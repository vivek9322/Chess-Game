'use client';

import React from 'react';
import { GameState } from '@/lib/chess-game';

interface GameControlsProps {
  gameState: GameState | null;
  playerColor: 'white' | 'black' | null;
  onJoinGame: () => void;
  onRestartGame: () => void;
  isJoining: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  playerColor,
  onJoinGame,
  onRestartGame,
  isJoining
}) => {
  const canRestart = gameState && 
    ['checkmate', 'stalemate', 'draw'].includes(gameState.gameStatus);

  return (
    <div className="game-controls">
      <button
        className="btn btn-primary"
        onClick={onJoinGame}
        disabled={isJoining || playerColor !== null}
      >
        {isJoining ? 'Joining...' : playerColor ? 'Joined' : 'Join Game'}
      </button>
      
      <button
        className="btn btn-secondary"
        onClick={onRestartGame}
        disabled={!canRestart}
      >
        Restart Game
      </button>
    </div>
  );
};

export default GameControls;
