'use client';

import React from 'react';
import { GameState } from '@/lib/chess-game';

interface GameInfoProps {
  gameState: GameState | null;
  playerColor: 'white' | 'black' | null;
}

const GameInfo: React.FC<GameInfoProps> = ({ gameState, playerColor }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'check':
        return '#ff9800';
      case 'checkmate':
        return '#f44336';
      case 'stalemate':
        return '#9c27b0';
      case 'draw':
        return '#607d8b';
      case 'in_progress':
        return '#4caf50';
      default:
        return '#2196f3';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'waiting':
        return 'Waiting for players...';
      case 'in_progress':
        return 'Game in progress';
      case 'check':
        return 'Check!';
      case 'checkmate':
        return 'Checkmate!';
      case 'stalemate':
        return 'Stalemate!';
      case 'draw':
        return 'Draw!';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="game-info">
      <div className="player-info">
        <span>You are playing as: </span>
        <span 
          style={{ 
            color: playerColor === 'white' ? '#2c3e50' : '#e74c3c',
            fontWeight: 'bold'
          }}
        >
          {playerColor || 'Connecting...'}
        </span>
      </div>
      
      <div className="turn-info">
        <span>Current turn: </span>
        <span 
          style={{ 
            color: gameState?.currentPlayer === 'white' ? '#2c3e50' : '#e74c3c',
            fontWeight: 'bold'
          }}
        >
          {gameState?.currentPlayer || 'Waiting...'}
        </span>
      </div>
      
      <div className="game-status">
        <span>Status: </span>
        <span 
          style={{ 
            color: getStatusColor(gameState?.gameStatus || 'waiting'),
            fontWeight: 'bold'
          }}
        >
          {getStatusText(gameState?.gameStatus || 'waiting')}
        </span>
      </div>
    </div>
  );
};

export default GameInfo;
