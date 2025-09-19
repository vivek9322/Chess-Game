export interface Piece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: 'white' | 'black';
}

export interface Move {
  from: [number, number];
  to: [number, number];
  piece: Piece;
  capturedPiece?: Piece;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: 'white' | 'black';
  gameStatus: 'waiting' | 'in_progress' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  lastMove: Move | null;
  moveHistory: Move[];
}

export class ChessGame {
  private board: (Piece | null)[][];
  private currentPlayer: 'white' | 'black';
  private gameStatus: 'waiting' | 'in_progress' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  private lastMove: Move | null;
  private moveHistory: Move[];

  constructor() {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.gameStatus = 'waiting';
    this.lastMove = null;
    this.moveHistory = [];
  }

  private initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Place pieces in starting positions
    const pieceOrder: Piece['type'][] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    // Black pieces (top)
    for (let col = 0; col < 8; col++) {
      board[0][col] = { type: pieceOrder[col], color: 'black' };
      board[1][col] = { type: 'pawn', color: 'black' };
    }
    
    // White pieces (bottom)
    for (let col = 0; col < 8; col++) {
      board[7][col] = { type: pieceOrder[col], color: 'white' };
      board[6][col] = { type: 'pawn', color: 'white' };
    }
    
    return board;
  }

  isValidMove(from: [number, number], to: [number, number], player: 'white' | 'black'): boolean {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    // Check if move is within bounds
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    
    const piece = this.board[fromRow][fromCol];
    const targetPiece = this.board[toRow][toCol];
    
    // Check if piece exists and belongs to current player
    if (!piece || piece.color !== player) return false;
    
    // Check if target square has own piece
    if (targetPiece && targetPiece.color === player) return false;
    
    // Basic move validation
    return this.isValidPieceMove(piece, from, to);
  }

  private isValidPieceMove(piece: Piece, from: [number, number], to: [number, number]): boolean {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    switch (piece.type) {
      case 'pawn':
        return this.isValidPawnMove(piece, from, to);
      case 'rook':
        return (rowDiff === 0 || colDiff === 0) && this.isPathClear(from, to);
      case 'knight':
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
      case 'bishop':
        return rowDiff === colDiff && this.isPathClear(from, to);
      case 'queen':
        return (rowDiff === colDiff || rowDiff === 0 || colDiff === 0) && this.isPathClear(from, to);
      case 'king':
        return rowDiff <= 1 && colDiff <= 1;
      default:
        return false;
    }
  }

  private isValidPawnMove(piece: Piece, from: [number, number], to: [number, number]): boolean {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;
    
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    
    // Forward move
    if (colDiff === 0 && this.board[toRow][toCol] === null) {
      if (rowDiff === direction) return true;
      if (fromRow === startRow && rowDiff === 2 * direction) return true;
    }
    
    // Diagonal capture
    if (colDiff === 1 && rowDiff === direction && this.board[toRow][toCol] !== null) {
      return true;
    }
    
    return false;
  }

  private isPathClear(from: [number, number], to: [number, number]): boolean {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (this.board[currentRow][currentCol] !== null) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  }

  makeMove(from: [number, number], to: [number, number], player: 'white' | 'black'): boolean {
    if (!this.isValidMove(from, to, player)) return false;
    
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const piece = this.board[fromRow][fromCol];
    const capturedPiece = this.board[toRow][toCol];
    
    // Make the move temporarily
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;
    
    // Check if this move puts the player's own king in check
    if (this.isInCheck(player)) {
      // Undo the move
      this.board[fromRow][fromCol] = piece;
      this.board[toRow][toCol] = capturedPiece;
      return false;
    }
    
    // Record the move
    this.lastMove = { from, to, piece, capturedPiece };
    this.moveHistory.push({ from, to, piece, capturedPiece });
    
    // Switch players
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
    
    // Check game status
    this.updateGameStatus();
    
    return true;
  }

  private updateGameStatus(): void {
    const opponent = this.currentPlayer === 'white' ? 'black' : 'white';
    
    // Check if current player is in check
    if (this.isInCheck(this.currentPlayer)) {
      this.gameStatus = 'check';
      
      // Check if it's checkmate
      if (this.isCheckmate(this.currentPlayer)) {
        this.gameStatus = 'checkmate';
        return;
      }
    } else {
      // Check if it's stalemate
      if (this.isStalemate(this.currentPlayer)) {
        this.gameStatus = 'stalemate';
        return;
      }
      
      // Check for draw conditions
      if (this.isDraw()) {
        this.gameStatus = 'draw';
        return;
      }
    }
    
    // If no special conditions, game continues
    if (this.gameStatus !== 'checkmate' && this.gameStatus !== 'stalemate' && this.gameStatus !== 'draw') {
      this.gameStatus = 'in_progress';
    }
  }

  private isInCheck(color: 'white' | 'black'): boolean {
    const kingPos = this.findKing(color);
    if (!kingPos) return false;
    
    const opponent = color === 'white' ? 'black' : 'white';
    
    // Check if any opponent piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === opponent) {
          if (this.isValidPieceMove(piece, [row, col], kingPos)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  private findKing(color: 'white' | 'black'): [number, number] | null {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.type === 'king' && piece.color === color) {
          return [row, col];
        }
      }
    }
    return null;
  }

  private isCheckmate(color: 'white' | 'black'): boolean {
    if (!this.isInCheck(color)) return false;
    
    // Try all possible moves for the current player
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (this.isValidMove([row, col], [toRow, toCol], color)) {
                // Make the move temporarily
                const originalPiece = this.board[toRow][toCol];
                this.board[toRow][toCol] = piece;
                this.board[row][col] = null;
                
                // Check if this move gets out of check
                const stillInCheck = this.isInCheck(color);
                
                // Undo the move
                this.board[row][col] = piece;
                this.board[toRow][toCol] = originalPiece;
                
                if (!stillInCheck) {
                  return false; // Found a legal move
                }
              }
            }
          }
        }
      }
    }
    
    return true; // No legal moves found
  }

  private isStalemate(color: 'white' | 'black'): boolean {
    if (this.isInCheck(color)) return false;
    
    // Check if player has any legal moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (this.isValidMove([row, col], [toRow, toCol], color)) {
                return false; // Found a legal move
              }
            }
          }
        }
      }
    }
    
    return true; // No legal moves found
  }

  private isDraw(): boolean {
    // Check for insufficient material
    const pieces = this.getAllPieces();
    const whitePieces = pieces.filter(p => p.color === 'white');
    const blackPieces = pieces.filter(p => p.color === 'black');
    
    // King vs King
    if (whitePieces.length === 1 && blackPieces.length === 1) {
      return true;
    }
    
    // King and Bishop vs King
    if ((whitePieces.length === 2 && whitePieces.some(p => p.type === 'bishop') && 
         blackPieces.length === 1) ||
        (blackPieces.length === 2 && blackPieces.some(p => p.type === 'bishop') && 
         whitePieces.length === 1)) {
      return true;
    }
    
    // King and Knight vs King
    if ((whitePieces.length === 2 && whitePieces.some(p => p.type === 'knight') && 
         blackPieces.length === 1) ||
        (blackPieces.length === 2 && blackPieces.some(p => p.type === 'knight') && 
         whitePieces.length === 1)) {
      return true;
    }
    
    // Check for 50-move rule (simplified - just check move count)
    if (this.moveHistory.length >= 100) { // 50 moves per player
      return true;
    }
    
    return false;
  }

  private getAllPieces(): Piece[] {
    const pieces: Piece[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (piece) {
          pieces.push(piece);
        }
      }
    }
    return pieces;
  }

  getGameState(): GameState {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      gameStatus: this.gameStatus,
      lastMove: this.lastMove,
      moveHistory: this.moveHistory
    };
  }

  reset(): void {
    this.board = this.initializeBoard();
    this.currentPlayer = 'white';
    this.gameStatus = 'waiting';
    this.lastMove = null;
    this.moveHistory = [];
  }
}
