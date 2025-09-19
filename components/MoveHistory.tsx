'use client';

import React from 'react';
import { GameState } from '@/lib/chess-game';

interface MoveHistoryProps {
  gameState: GameState | null;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ gameState }) => {
  const squareToNotation = (square: [number, number]): string => {
    const [row, col] = square;
    const file = String.fromCharCode(97 + col); // a-h
    const rank = 8 - row; // 1-8
    return file + rank;
  };

  return (
    <div className="move-history">
      <h3>Move History</h3>
      <div className="move-list">
        {!gameState || gameState.moveHistory.length === 0 ? (
          <p>No moves yet</p>
        ) : (
          gameState.moveHistory.map((move, index) => {
            const fromSquare = squareToNotation(move.from);
            const toSquare = squareToNotation(move.to);
            return (
              <div key={index} className="move-item">
                {index + 1}. {fromSquare} → {toSquare}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MoveHistory;
