'use client';

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState } from '@/lib/chess-game';
import ChessBoard from '@/components/ChessBoard';
import GameInfo from '@/components/GameInfo';
import MoveHistory from '@/components/MoveHistory';
import GameControls from '@/components/GameControls';
import GameOverModal from '@/components/GameOverModal';

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const gameId = 'default';

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000', {
      path: '/api/socket'
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('player-assigned', (data: { color: 'white' | 'black'; gameState: GameState }) => {
      setPlayerColor(data.color);
      setGameState(data.gameState);
      setIsJoining(false);
    });

    newSocket.on('game-update', (gameState: GameState) => {
      setGameState(gameState);
    });

    newSocket.on('move-made', (data: { from: [number, number]; to: [number, number]; gameState: GameState }) => {
      setGameState(data.gameState);
      setSelectedSquare(null);
    });

    newSocket.on('invalid-move', (message: string) => {
      alert(message);
      setSelectedSquare(null);
    });

    newSocket.on('game-full', () => {
      alert('Game is full. Please try again later.');
      setIsJoining(false);
    });

    newSocket.on('player-left', () => {
      alert('Opponent left the game.');
      if (gameState) {
        setGameState({ ...gameState, gameStatus: 'waiting' });
      }
    });

    newSocket.on('game-restarted', (gameState: GameState) => {
      setGameState(gameState);
      setSelectedSquare(null);
      setShowGameOverModal(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Check for game over
    if (gameState && ['checkmate', 'stalemate', 'draw'].includes(gameState.gameStatus)) {
      setShowGameOverModal(true);
    }
  }, [gameState]);

  const handleSquareClick = (row: number, col: number) => {
    if (!gameState || !playerColor || gameState.currentPlayer !== playerColor) return;

    if (selectedSquare) {
      // Try to make a move
      makeMove(selectedSquare, [row, col]);
      setSelectedSquare(null);
    } else {
      // Select a piece
      const piece = gameState.board[row][col];
      if (piece && piece.color === playerColor) {
        setSelectedSquare([row, col]);
      }
    }
  };

  const handlePieceDrag = (from: [number, number], to: [number, number]) => {
    makeMove(from, to);
  };

  const makeMove = (from: [number, number], to: [number, number]) => {
    if (!socket || !gameState || !playerColor || gameState.currentPlayer !== playerColor) return;

    socket.emit('make-move', {
      gameId,
      from,
      to
    });
  };

  const handleJoinGame = () => {
    if (!socket) return;
    
    setIsJoining(true);
    socket.emit('join-game', gameId);
  };

  const handleRestartGame = () => {
    if (!socket) return;
    
    socket.emit('restart-game', gameId);
  };

  const handleCloseModal = () => {
    setShowGameOverModal(false);
  };

  const handleModalRestart = () => {
    handleRestartGame();
  };

  return (
    <div className="container">
      <header>
        <h1>♔ Online Chess Game ♛</h1>
        <GameInfo gameState={gameState} playerColor={playerColor} />
      </header>

      <main>
        <div className="chess-container">
          <ChessBoard
            gameState={gameState}
            playerColor={playerColor}
            onSquareClick={handleSquareClick}
            onPieceDrag={handlePieceDrag}
            selectedSquare={selectedSquare}
          />
          
          <GameControls
            gameState={gameState}
            playerColor={playerColor}
            onJoinGame={handleJoinGame}
            onRestartGame={handleRestartGame}
            isJoining={isJoining}
          />
        </div>

        <div className="game-panel">
          <MoveHistory gameState={gameState} />
          
          <div className="game-rules">
            <h3>How to Play</h3>
            <ul>
              <li>Drag pieces to make moves</li>
              <li>White always moves first</li>
              <li>Click "Join Game" to start</li>
              <li>Wait for another player to join</li>
            </ul>
          </div>
        </div>
      </main>

      <GameOverModal
        gameState={gameState}
        isOpen={showGameOverModal}
        onClose={handleCloseModal}
        onRestart={handleModalRestart}
      />
    </div>
  );
}
