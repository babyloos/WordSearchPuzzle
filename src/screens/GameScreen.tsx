import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BG, SURFACE, ACCENT, TEXT, TEXT_DIM, CELL_BORDER } from '../constants/theme';
import { t } from '../i18n';
import { Difficulty } from '../game/words';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../utils/sounds';
import { loadInterstitial, showInterstitialIfReady } from '../utils/ads';
import WordGrid from '../components/WordGrid';
import WordList from '../components/WordList';

type Props = { navigation: NativeStackNavigationProp<any> };

const DIFF_LABELS: Record<Difficulty, string> = { easy: t.easy, medium: t.medium, hard: t.hard };

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function GameScreen({ navigation }: Props) {
  const seconds = useGameStore(s => s.seconds);
  const placed = useGameStore(s => s.placed);
  const foundWords = useGameStore(s => s.foundWords);
  const won = useGameStore(s => s.won);
  const difficulty = useGameStore(s => s.difficulty);
  const startGame = useGameStore(s => s.startGame);
  const tick = useGameStore(s => s.tick);


  const prevWon       = useRef(won);
  const prevFoundSize = useRef(foundWords.size);
  const levelsSinceAd = useRef(0);

  useEffect(() => { loadInterstitial(); }, []);

  useEffect(() => {
    if (won && !prevWon.current) {
      playSound('win');
      levelsSinceAd.current += 1;
      if (levelsSinceAd.current >= 3) { levelsSinceAd.current = 0; showInterstitialIfReady(); }
    }
    prevWon.current = won;
  }, [won]);

  useEffect(() => {
    if (foundWords.size > prevFoundSize.current) playSound('pour');
    prevFoundSize.current = foundWords.size;
  }, [foundWords.size]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => tick(), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [tick]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>竊・{t.newGame}</Text>
        </TouchableOpacity>
        <Text style={styles.diffLabel}>{DIFF_LABELS[difficulty]}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{t.time}</Text>
          <Text style={styles.statValue}>{formatTime(seconds)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{t.wordsFound}</Text>
          <Text style={styles.statValue}>{foundWords.size}/{placed.length}</Text>
        </View>
      </View>

      {/* Word list */}
      <WordList />

      {/* Grid */}
      <ScrollView style={styles.gridScroll} contentContainerStyle={styles.gridContent}>
        <WordGrid />
      </ScrollView>

      {/* Win Modal */}
      <Modal visible={won} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalEmoji}>脂</Text>
            <Text style={styles.modalTitle}>{t.youWin}</Text>
            <Text style={styles.modalTime}>{formatTime(seconds)}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => startGame(difficulty)}>
              <Text style={styles.modalBtnText}>{t.playAgain}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => navigation.goBack()}>
              <Text style={styles.modalBtnSecondaryText}>{t.selectDifficulty}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingHorizontal: 8, paddingBottom: 8 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  backBtn: { padding: 4 },
  backText: { color: ACCENT, fontSize: 14 },
  diffLabel: { color: TEXT_DIM, fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: SURFACE,
    borderRadius: 10,
    marginBottom: 6,
  },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 11, color: TEXT_DIM },
  statValue: { fontSize: 18, fontWeight: '700', color: TEXT },
  gridScroll: { flex: 1 },
  gridContent: { alignItems: 'center', paddingVertical: 8 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  modal: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: CELL_BORDER,
  },
  modalEmoji: { fontSize: 48, marginBottom: 8 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: ACCENT, marginBottom: 8 },
  modalTime: { fontSize: 36, fontWeight: '700', color: TEXT, marginBottom: 24 },
  modalBtn: {
    backgroundColor: ACCENT,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  modalBtnSecondary: { paddingVertical: 8 },
  modalBtnSecondaryText: { fontSize: 14, color: TEXT_DIM },
});

