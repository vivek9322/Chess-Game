'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Piece, GameState } from '@/lib/chess-game';

interface ChessBoardProps {
  gameState: GameState | null;
  playerColor: 'white' | 'black' | null;
  onSquareClick: (row: number, col: number) => void;
  onPieceDrag: (from: [number, number], to: [number, number]) => void;
  selectedSquare: [number, number] | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  gameState,
  playerColor,
  onSquareClick,
  onPieceDrag,
  selectedSquare
}) => {
  const [draggedPiece, setDraggedPiece] = useState<[number, number] | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const getPieceSymbol = (piece: Piece): string => {
    const symbols = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    return symbols[piece.color][piece.type];
  };

  const handleSquareClick = (row: number, col: number) => {
    onSquareClick(row, col);
  };

  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    if (!gameState || !playerColor) {
      e.preventDefault();
      return;
    }

    const piece = gameState.board[row][col];
    if (!piece || piece.color !== playerColor) {
      e.preventDefault();
      return;
    }

    if (gameState.currentPlayer !== playerColor) {
      e.preventDefault();
      return;
    }

    setDraggedPiece([row, col]);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (draggedPiece) {
      onPieceDrag(draggedPiece, [row, col]);
      setDraggedPiece(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  const isLightSquare = (row: number, col: number): boolean => {
    return (row + col) % 2 === 0;
  };

  const isLastMove = (row: number, col: number): boolean => {
    if (!gameState?.lastMove) return false;
    const { from, to } = gameState.lastMove;
    return (from[0] === row && from[1] === col) || (to[0] === row && to[1] === col);
  };

  const isSelected = (row: number, col: number): boolean => {
    return selectedSquare ? selectedSquare[0] === row && selectedSquare[1] === col : false;
  };

  return (
    <div className="chessboard" ref={boardRef}>
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => {
          const piece = gameState?.board[row][col];
          const isLight = isLightSquare(row, col);
          const isLast = isLastMove(row, col);
          const isSelectedSquare = isSelected(row, col);

          return (
            <div
              key={`${row}-${col}`}
              className={`square ${isLight ? 'light' : 'dark'} ${
                isSelectedSquare ? 'selected' : ''
              } ${isLast ? 'last-move' : ''}`}
              onClick={() => handleSquareClick(row, col)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, row, col)}
            >
              {piece && (
                <div
                  className="piece"
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, row, col)}
                  onDragEnd={handleDragEnd}
                >
                  {getPieceSymbol(piece)}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
