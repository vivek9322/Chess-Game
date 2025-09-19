import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { ChessGame } from './chess-game';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

// Game state management
const games = new Map<string, ChessGame>();
const players = new Map<string, Map<string, 'white' | 'black'>>();

export const initializeSocket = (res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    return res.socket.server.io;
  }

  console.log('Socket is initializing');
  const io = new ServerIO(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    socket.on('join-game', (gameId: string) => {
      if (!gameId) {
        gameId = 'default';
      }
      
      let game = games.get(gameId);
      if (!game) {
        game = new ChessGame();
        games.set(gameId, game);
      }
      
      const playerCount = players.get(gameId)?.size || 0;
      
      if (playerCount >= 2) {
        socket.emit('game-full');
        return;
      }
      
      // Assign player color
      const playerColor = playerCount === 0 ? 'white' : 'black';
      
      if (!players.has(gameId)) {
        players.set(gameId, new Map());
      }
      
      players.get(gameId)!.set(socket.id, playerColor);
      socket.join(gameId);
      
      // Update game status if both players joined
      if (players.get(gameId)!.size === 2) {
        const gameState = game.getGameState();
        gameState.gameStatus = 'in_progress';
      }
      
      socket.emit('player-assigned', { 
        color: playerColor, 
        gameState: game.getGameState() 
      });
      io.to(gameId).emit('game-update', game.getGameState());
      
      console.log(`Player ${socket.id} joined game ${gameId} as ${playerColor}`);
    });
    
    socket.on('make-move', (data: { gameId: string; from: [number, number]; to: [number, number] }) => {
      const { gameId, from, to } = data;
      const game = games.get(gameId);
      const playerColor = players.get(gameId)?.get(socket.id);
      
      if (!game || !playerColor) return;
      
      const gameState = game.getGameState();
      if (gameState.currentPlayer !== playerColor) {
        socket.emit('invalid-move', 'Not your turn');
        return;
      }
      
      if (game.makeMove(from, to, playerColor)) {
        io.to(gameId).emit('move-made', {
          from,
          to,
          gameState: game.getGameState()
        });
      } else {
        socket.emit('invalid-move', 'Invalid move');
      }
    });
    
    socket.on('restart-game', (gameId: string) => {
      const game = games.get(gameId);
      if (game) {
        game.reset();
        io.to(gameId).emit('game-restarted', game.getGameState());
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Player disconnected:', socket.id);
      
      // Remove player from all games
      for (const [gameId, gamePlayers] of players.entries()) {
        if (gamePlayers.has(socket.id)) {
          gamePlayers.delete(socket.id);
          if (gamePlayers.size === 0) {
            players.delete(gameId);
            games.delete(gameId);
          } else {
            // Notify remaining players
            io.to(gameId).emit('player-left');
          }
          break;
        }
      }
    });
  });

  return io;
};
