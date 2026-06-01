export interface PlacedWord {
  word: string;
  row: number;
  col: number;
  dir: number; // index into DIRECTIONS
  cells: [number, number][]; // [row, col] of each letter
}

// 8 directions: right, down-right, down, down-left, left, up-left, up, up-right
const DIRECTIONS: [number, number][] = [
  [0, 1], [1, 1], [1, 0], [1, -1],
  [0, -1], [-1, -1], [-1, 0], [-1, 1],
];

function canPlace(grid: string[][], word: string, row: number, col: number, dir: number, size: number): boolean {
  const [dr, dc] = DIRECTIONS[dir];
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
  }
  return true;
}

function placeWord(grid: string[][], word: string, row: number, col: number, dir: number): [number, number][] {
  const [dr, dc] = DIRECTIONS[dir];
  const cells: [number, number][] = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    grid[r][c] = word[i];
    cells.push([r, c]);
  }
  return cells;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateGrid(size: number, words: string[]): { grid: string[][]; placed: PlacedWord[] } {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
  const placed: PlacedWord[] = [];

  for (const word of words) {
    let attempts = 0;
    let success = false;
    while (attempts < 200 && !success) {
      const dir = Math.floor(Math.random() * DIRECTIONS.length);
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (canPlace(grid, word, row, col, dir, size)) {
        const cells = placeWord(grid, word, row, col, dir);
        placed.push({ word, row, col, dir, cells });
        success = true;
      }
      attempts++;
    }
  }

  // Fill remaining cells with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
    }
  }

  return { grid, placed };
}
