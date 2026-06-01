import { getLocales } from 'expo-localization';

const locale = getLocales()[0]?.languageCode ?? 'en';
const lang = locale === 'ja' ? 'ja' : locale === 'zh' ? 'zh' : 'en';

const strings = {
  en: {
    appName: 'Word Search',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    newGame: 'New Game',
    time: 'Time',
    wordsFound: 'Found',
    youWin: 'All Words Found!',
    playAgain: 'Play Again',
    selectDifficulty: 'Select Difficulty',
    best: 'Best',
    findWords: 'Find all hidden words',
  },
  ja: {
    appName: 'ワード検索',
    easy: '易しい',
    medium: '普通',
    hard: '難しい',
    newGame: '新しいゲーム',
    time: '時間',
    wordsFound: '発見',
    youWin: '全単語発見！',
    playAgain: 'もう一度',
    selectDifficulty: '難易度を選択',
    best: 'ベスト',
    findWords: '隠れた単語を探そう',
  },
  zh: {
    appName: '单词搜索',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    newGame: '新游戏',
    time: '时间',
    wordsFound: '已找',
    youWin: '全部找到！',
    playAgain: '再玩一次',
    selectDifficulty: '选择难度',
    best: '最佳',
    findWords: '找出所有隐藏单词',
  },
};

export const t = strings[lang];
