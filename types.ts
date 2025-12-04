export interface WordItem {
  character: string;
  pinyin: string;
  english: string;
  emoji: string;
  sentence: string; // Simple example sentence
}

export enum AppView {
  HOME = 'HOME',
  LEARN = 'LEARN',
  QUIZ = 'QUIZ',
}

export interface ThemeOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'animals', name: '动物 (Animals)', icon: '🐼', color: 'bg-green-400' },
  { id: 'fruits', name: '水果 (Fruits)', icon: '🍎', color: 'bg-red-400' },
  { id: 'family', name: '家庭 (Family)', icon: '👨‍👩‍👧', color: 'bg-purple-400' },
  { id: 'colors', name: '颜色 (Colors)', icon: '🎨', color: 'bg-yellow-400' },
  { id: 'nature', name: '自然 (Nature)', icon: '🌳', color: 'bg-emerald-500' },
  { id: 'space', name: '太空 (Space)', icon: '🚀', color: 'bg-indigo-500' },
];