import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BG, SURFACE, ACCENT, TEXT, TEXT_DIM, CELL_BORDER } from '../constants/theme';
import { t } from '../i18n';
import { Difficulty, GRID_SIZE, WORD_COUNT } from '../game/words';
import { useGameStore } from '../store/gameStore';

type Props = { navigation: NativeStackNavigationProp<any> };

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const DIFF_LABELS: Record<Difficulty, string> = { easy: t.easy, medium: t.medium, hard: t.hard };

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function MiniPreview() {
  const letters = [
    ['W','O','R','D','S'],
    ['A','P','P','L','E'],
    ['T','I','G','E','R'],
    ['E','R','A','V','E'],
    ['R','S','T','O','R'],
  ];
  const highlighted = new Set(['0,0','0,1','0,2','0,3','1,1','1,2','1,3','1,4','2,0','2,1','2,2','2,3','2,4']);
  return (
    <View style={mini.board}>
      {letters.map((row, r) => (
        <View key={r} style={mini.row}>
          {row.map((l, c) => (
            <View key={c} style={[mini.cell, highlighted.has(`${r},${c}`) && mini.hl]}>
              <Text style={[mini.text, highlighted.has(`${r},${c}`) && mini.hlText]}>{l}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const mini = StyleSheet.create({
  board: { alignSelf: 'center', marginBottom: 24 },
  row: { flexDirection: 'row' },
  cell: { width: 34, height: 34, borderWidth: 0.5, borderColor: CELL_BORDER, backgroundColor: '#0f3460', alignItems: 'center', justifyContent: 'center' },
  hl: { backgroundColor: 'rgba(233,69,96,0.3)' },
  text: { fontSize: 13, color: '#e8e8ff', fontWeight: '600' },
  hlText: { color: '#e94560', fontWeight: '900' },
});

export default function HomeScreen({ navigation }: Props) {
  const startGame = useGameStore(s => s.startGame);
  const bestTimes = useGameStore(s => s.bestTimes);

  const handleStart = (difficulty: Difficulty) => {
    startGame(difficulty);
    navigation.navigate('Game');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.appName}</Text>
      <Text style={styles.subtitle}>{t.findWords}</Text>
      <MiniPreview />
      <Text style={styles.selectLabel}>{t.selectDifficulty}</Text>
      {DIFFICULTIES.map(d => (
        <TouchableOpacity key={d} style={styles.diffBtn} onPress={() => handleStart(d)}>
          <Text style={styles.diffLabel}>{DIFF_LABELS[d]}</Text>
          <Text style={styles.diffSub}>{GRID_SIZE[d]}×{GRID_SIZE[d]} · {WORD_COUNT[d]} words</Text>
          {bestTimes[d] !== null && (
            <Text style={styles.best}>{t.best}: {formatTime(bestTimes[d]!)}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  title: { fontSize: 30, fontWeight: 'bold', color: TEXT, marginBottom: 4, letterSpacing: 1 },
  subtitle: { fontSize: 13, color: TEXT_DIM, marginBottom: 20 },
  selectLabel: { fontSize: 14, color: TEXT_DIM, marginBottom: 12 },
  diffBtn: {
    width: '100%',
    backgroundColor: SURFACE,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CELL_BORDER,
  },
  diffLabel: { fontSize: 20, fontWeight: '600', color: ACCENT },
  diffSub: { fontSize: 12, color: TEXT_DIM, marginTop: 2 },
  best: { fontSize: 11, color: TEXT_DIM, marginTop: 2 },
});
