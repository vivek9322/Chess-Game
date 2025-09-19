'use client';

import React from 'react';
import { GameState } from '@/lib/chess-game';

interface GameOverModalProps {
  gameState: GameState | null;
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  isOpen,
  onClose,
  onRestart
}) => {
  if (!isOpen || !gameState) return null;

  const isGameOver = ['checkmate', 'stalemate', 'draw'].includes(gameState.gameStatus);

  if (!isGameOver) return null;

  const getGameOverContent = () => {
    switch (gameState.gameStatus) {
      case 'checkmate':
        return {
          title: 'Checkmate!',
          message: `${gameState.currentPlayer === 'white' ? 'Black' : 'White'} wins!`
        };
      case 'stalemate':
        return {
          title: 'Stalemate!',
          message: 'The game is a draw.'
        };
      case 'draw':
        return {
          title: 'Draw!',
          message: 'The game ended in a draw.'
        };
      default:
        return {
          title: 'Game Over',
          message: 'The game has ended.'
        };
    }
  };

  const { title, message } = getGameOverContent();

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={onRestart}>
            Play Again
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
