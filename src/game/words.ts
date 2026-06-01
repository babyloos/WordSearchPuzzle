export type Difficulty = 'easy' | 'medium' | 'hard';

export const GRID_SIZE: Record<Difficulty, number> = {
  easy: 10,
  medium: 13,
  hard: 16,
};

export const WORD_COUNT: Record<Difficulty, number> = {
  easy: 8,
  medium: 12,
  hard: 16,
};

// Word pool (English — displayed as-is for all languages since word search is language-neutral)
const WORD_POOL = [
  'APPLE', 'BRAVE', 'CLOUD', 'DANCE', 'EARTH',
  'FLAME', 'GRACE', 'HEART', 'ISLAND', 'JEWEL',
  'KNEEL', 'LIGHT', 'MOUSE', 'NIGHT', 'OCEAN',
  'PIANO', 'QUEEN', 'RIVER', 'SOLAR', 'TIGER',
  'ULTRA', 'VOICE', 'WATER', 'XENON', 'YACHT',
  'ZEBRA', 'AMBER', 'BLOOM', 'CEDAR', 'DREAM',
  'EAGLE', 'FROST', 'GLOBE', 'HONEY', 'IRIS',
  'JADE', 'KARMA', 'LOTUS', 'MAPLE', 'NORTH',
  'OPAL', 'PEARL', 'QUEST', 'ROBIN', 'STORM',
  'TRAIL', 'UNITY', 'VISTA', 'WOLF', 'XRAY',
  'YOUTH', 'ZONE', 'ARCH', 'BOLT', 'CAVE',
  'DAWN', 'ECHO', 'FERN', 'GLOW', 'HALO',
  'IRON', 'JAZZ', 'KITE', 'LAVA', 'MIST',
  'NOVA', 'OLIVE', 'PETAL', 'QUARTZ', 'RIDGE',
  'SAGE', 'THORN', 'URBAN', 'VALE', 'WIND',
];

export function pickWords(count: number): string[] {
  const pool = [...WORD_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
