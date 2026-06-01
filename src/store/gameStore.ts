import { create } from 'zustand';
import { Difficulty, GRID_SIZE, WORD_COUNT, pickWords } from '../game/words';
import { generateGrid, PlacedWord } from '../game/generator';

export interface Selection {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

interface GameState {
  grid: string[][];
  placed: PlacedWord[];
  foundWords: Set<string>;
  wordColors: Record<string, string>;
  difficulty: Difficulty;
  selection: Selection | null;
  dragging: boolean;
  seconds: number;
  running: boolean;
  won: boolean;
  bestTimes: Record<Difficulty, number | null>;

  startGame: (difficulty: Difficulty) => void;
  startDrag: (row: number, col: number) => void;
  updateDrag: (row: number, col: number) => void;
  endDrag: () => void;
  tick: () => void;
}

const FOUND_COLORS = [
  '#e94560', '#53d8fb', '#f5a623', '#7fff00',
  '#ff7c7c', '#c39bd3', '#48c9b0', '#f1c40f',
  '#ff6b9d', '#45b7d1', '#96e6a1', '#ffd93d',
  '#6c5ce7', '#fd79a8', '#00b894', '#e17055',
];

// Get cells between two points in 8 directions (if they align)
function getCellsBetween(r1: number, c1: number, r2: number, c2: number): [number, number][] | null {
  const dr = r2 - r1;
  const dc = c2 - c1;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  if (len === 0) return [[r1, c1]];

  // Must be perfectly horizontal, vertical, or diagonal
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;

  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
  const cells: [number, number][] = [];
  for (let i = 0; i <= len; i++) {
    cells.push([r1 + stepR * i, c1 + stepC * i]);
  }
  return cells;
}

function cellsToKey(cells: [number, number][]): string {
  return cells.map(([r, c]) => `${r},${c}`).join('|');
}

export const useGameStore = create<GameState>((set, get) => ({
  grid: [],
  placed: [],
  foundWords: new Set(),
  wordColors: {},
  difficulty: 'easy',
  selection: null,
  dragging: false,
  seconds: 0,
  running: false,
  won: false,
  bestTimes: { easy: null, medium: null, hard: null },

  startGame: (difficulty) => {
    const size = GRID_SIZE[difficulty];
    const count = WORD_COUNT[difficulty];
    const words = pickWords(count);
    const { grid, placed } = generateGrid(size, words);
    set({
      grid,
      placed,
      foundWords: new Set(),
      wordColors: {},
      difficulty,
      selection: null,
      dragging: false,
      seconds: 0,
      running: true,
      won: false,
    });
  },

  startDrag: (row, col) => {
    set({ dragging: true, selection: { startRow: row, startCol: col, endRow: row, endCol: col } });
  },

  updateDrag: (row, col) => {
    const { dragging, selection } = get();
    if (!dragging || !selection) return;
    set({ selection: { ...selection, endRow: row, endCol: col } });
  },

  endDrag: () => {
    const { selection, placed, foundWords, wordColors, seconds, difficulty, bestTimes } = get();
    if (!selection) { set({ dragging: false }); return; }

    const cells = getCellsBetween(
      selection.startRow, selection.startCol,
      selection.endRow, selection.endCol
    );

    let newFound = new Set(foundWords);
    let newColors = { ...wordColors };

    if (cells && cells.length > 1) {
      const selKey = cellsToKey(cells);
      const selKeyRev = cellsToKey([...cells].reverse());

      for (const pw of placed) {
        if (foundWords.has(pw.word)) continue;
        const pwKey = cellsToKey(pw.cells);
        const pwKeyRev = cellsToKey([...pw.cells].reverse());
        if (selKey === pwKey || selKeyRev === pwKey || selKey === pwKeyRev) {
          newFound = new Set([...newFound, pw.word]);
          const colorIdx = newFound.size - 1;
          newColors = { ...newColors, [pw.word]: FOUND_COLORS[colorIdx % FOUND_COLORS.length] };
        }
      }
    }

    const won = newFound.size === placed.length && placed.length > 0;
    const updates: Partial<GameState> = {
      dragging: false,
      selection: null,
      foundWords: newFound,
      wordColors: newColors,
    };

    if (won) {
      const prev = bestTimes[difficulty];
      updates.won = true;
      updates.running = false;
      updates.bestTimes = {
        ...bestTimes,
        [difficulty]: prev === null || seconds < prev ? seconds : prev,
      };
    }

    set(updates);
  },

  tick: () => {
    if (get().running) set(s => ({ seconds: s.seconds + 1 }));
  },
}));
