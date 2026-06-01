import React, { memo, useCallback, useMemo, useRef } from 'react';
import { View, Text, PanResponder, StyleSheet, useWindowDimensions } from 'react-native';
import { CELL_BG, CELL_BORDER, TEXT, SELECTED_BG, FOUND_COLORS } from '../constants/theme';
import { useGameStore } from '../store/gameStore';

function getCellsBetweenInGrid(r1: number, c1: number, r2: number, c2: number): Set<string> {
  const dr = r2 - r1;
  const dc = c2 - c1;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  if (len === 0) return new Set([`${r1},${c1}`]);
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return new Set([`${r1},${c1}`]);
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
  const result = new Set<string>();
  for (let i = 0; i <= len; i++) {
    result.add(`${r1 + stepR * i},${c1 + stepC * i}`);
  }
  return result;
}

const WordGrid = memo(() => {
  const grid = useGameStore(s => s.grid);
  const placed = useGameStore(s => s.placed);
  const foundWords = useGameStore(s => s.foundWords);
  const wordColors = useGameStore(s => s.wordColors);
  const selection = useGameStore(s => s.selection);
  const startDrag = useGameStore(s => s.startDrag);
  const updateDrag = useGameStore(s => s.updateDrag);
  const endDrag = useGameStore(s => s.endDrag);

  const { width } = useWindowDimensions();
  const size = grid.length;
  const cellSize = size > 0 ? Math.floor((width - 16) / size) : 30;

  const containerRef = useRef<View>(null);
  const layoutRef = useRef<{ x: number; y: number } | null>(null);

  const getCell = useCallback((pageX: number, pageY: number): [number, number] | null => {
    if (!layoutRef.current) return null;
    const { x, y } = layoutRef.current;
    const col = Math.floor((pageX - x) / cellSize);
    const row = Math.floor((pageY - y) / cellSize);
    if (row < 0 || row >= size || col < 0 || col >= size) return null;
    return [row, col];
  }, [cellSize, size]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const cell = getCell(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      if (cell) startDrag(cell[0], cell[1]);
    },
    onPanResponderMove: (evt) => {
      const cell = getCell(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      if (cell) updateDrag(cell[0], cell[1]);
    },
    onPanResponderRelease: () => endDrag(),
    onPanResponderTerminate: () => endDrag(),
  }), [getCell, startDrag, updateDrag, endDrag]);

  // Build highlight maps
  const foundCellColors = useMemo(() => {
    const map: Record<string, string> = {};
    for (const pw of placed) {
      if (foundWords.has(pw.word)) {
        const color = wordColors[pw.word] ?? FOUND_COLORS[0];
        for (const [r, c] of pw.cells) {
          map[`${r},${c}`] = color;
        }
      }
    }
    return map;
  }, [placed, foundWords, wordColors]);

  const selectedCells = useMemo(() => {
    if (!selection) return new Set<string>();
    return getCellsBetweenInGrid(
      selection.startRow, selection.startCol,
      selection.endRow, selection.endCol
    );
  }, [selection]);

  return (
    <View
      ref={containerRef}
      onLayout={(e) => {
        containerRef.current?.measure((_, __, ___, ____, pageX, pageY) => {
          layoutRef.current = { x: pageX, y: pageY };
        });
      }}
      {...panResponder.panHandlers}
      style={styles.grid}
    >
      {grid.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((letter, c) => {
            const key = `${r},${c}`;
            const foundColor = foundCellColors[key];
            const isSelected = selectedCells.has(key);
            return (
              <View
                key={c}
                style={[
                  styles.cell,
                  { width: cellSize, height: cellSize },
                  foundColor ? { backgroundColor: foundColor + '55' } : { backgroundColor: CELL_BG },
                  isSelected && styles.selectedCell,
                ]}
              >
                <Text style={[
                  styles.letter,
                  { fontSize: cellSize > 28 ? 14 : cellSize > 20 ? 11 : 9 },
                  foundColor && { color: foundColor, fontWeight: '800' },
                  isSelected && styles.selectedLetter,
                ]}>
                  {letter}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  grid: { alignSelf: 'center' },
  row: { flexDirection: 'row' },
  cell: {
    borderWidth: 0.5,
    borderColor: CELL_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCell: {
    backgroundColor: SELECTED_BG,
  },
  letter: {
    color: TEXT,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedLetter: {
    color: '#ffffff',
    fontWeight: '900',
  },
});

export default WordGrid;
