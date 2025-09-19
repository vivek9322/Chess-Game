# Next.js Chess Game

A real-time multiplayer chess game built with **Next.js**, **React**, **TypeScript**, and **Socket.IO**. Two players can connect and play against each other with live move synchronization.

## Features

- **Real-time multiplayer gameplay** using WebSockets
- **Modern React components** with TypeScript
- **Clean and responsive UI** with draggable pieces
- **Legal move enforcement** - no invalid moves allowed
- **Automatic player assignment** - white and black pieces assigned automatically
- **Turn management** - clear indication of whose turn it is
- **Move highlighting** - last move is highlighted on the board
- **Game state tracking** - shows check, checkmate, stalemate, and draw conditions
- **Move history** - displays all moves made during the game
- **Game restart** - option to restart once the game ends
- **Responsive design** - works on desktop and mobile devices
- **Server-side rendering** with Next.js

## Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Game

1. Start the development server:
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm run build
   npm start
   ```

2. Open your web browser and go to:
   ```
   http://localhost:3000
   ```

3. Click "Join Game" to start playing
4. Open another browser tab/window and join the same game to play against yourself, or share the link with another player

## How to Play

1. **Joining**: Click the "Join Game" button to join a game room
2. **Player Assignment**: Players are automatically assigned white (first player) or black (second player) pieces
3. **Making Moves**: 
   - Click on a piece to select it, then click on the destination square
   - Or drag and drop pieces to make moves
4. **Turn Management**: Only the current player can make moves
5. **Game End**: The game ends when checkmate, stalemate, or draw conditions are met
6. **Restart**: Use the "Restart Game" button to start a new game

## Game Rules

- White always moves first
- Standard chess rules apply
- Invalid moves are rejected
- Players cannot move pieces that would put their own king in check
- Game automatically detects check, checkmate, stalemate, and draw conditions

## Technical Details

### Backend (Next.js API Routes)
- **Next.js API Routes** - Serverless API endpoints
- **Socket.IO** - Real-time bidirectional communication
- **TypeScript** - Type-safe chess game logic
- **Custom Chess Engine** - Move validation and game logic

### Frontend (React + TypeScript)
- **Next.js App Router** - Modern React framework
- **React Components** - Modular, reusable UI components
- **TypeScript** - Type-safe frontend code
- **Responsive CSS Grid** - Chessboard layout
- **Drag and Drop API** - Piece movement
- **Socket.IO Client** - Real-time communication
- **Modern CSS** - Beautiful UI with animations

### Game Logic
- Complete chess move validation
- Check, checkmate, and stalemate detection
- Draw condition detection (insufficient material, 50-move rule)
- Move history tracking
- Real-time game state synchronization

## File Structure

```
chess-game/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ChessBoard.tsx     # Chess board component
│   ├── GameControls.tsx   # Game control buttons
│   ├── GameInfo.tsx       # Game status display
│   ├── GameOverModal.tsx  # Game over modal
│   └── MoveHistory.tsx    # Move history component
├── lib/                   # Utility libraries
│   ├── chess-game.ts      # Chess game logic
│   └── socket.ts          # Socket.IO server setup
├── pages/                 # API routes
│   └── api/
│       └── socket.ts       # Socket.IO API endpoint
├── package.json           # Dependencies and scripts
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development

To modify the game:

1. **Backend changes**: Edit files in `lib/` and `pages/api/`
2. **Frontend changes**: Edit components in `components/` and `app/`
3. **Styling**: Modify `app/globals.css` for visual changes
4. **Game logic**: Update the `ChessGame` class in `lib/chess-game.ts`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Future Enhancements

- Multiple game rooms
- Player authentication
- Game history persistence
- Spectator mode
- Chat functionality
- Tournament mode
- Mobile app version
- Database integration
- User profiles and statistics

## License

MIT License - feel free to use and modify as needed.
