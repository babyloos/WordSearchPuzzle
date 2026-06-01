import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WORD_FOUND_TEXT, WORD_PENDING_TEXT, TEXT_DIM } from '../constants/theme';
import { useGameStore } from '../store/gameStore';

const WordList = memo(() => {
  const placed = useGameStore(s => s.placed);
  const foundWords = useGameStore(s => s.foundWords);
  const wordColors = useGameStore(s => s.wordColors);

  const words = placed.map(pw => pw.word);

  return (
    <View style={styles.container}>
      <View style={styles.wordWrap}>
        {words.map(word => {
          const found = foundWords.has(word);
          return (
            <Text
              key={word}
              style={[
                styles.word,
                found
                  ? { color: wordColors[word] ?? WORD_FOUND_TEXT, textDecorationLine: 'line-through' }
                  : { color: WORD_PENDING_TEXT },
              ]}
            >
              {word}
            </Text>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  wordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  word: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});

export default WordList;
