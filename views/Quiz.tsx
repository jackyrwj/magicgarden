import React, { useState, useEffect } from 'react';
import { WordItem, ThemeOption } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, RefreshCw, Star, Trophy } from 'lucide-react';
import { generateWordList } from '../services/geminiService';
import confetti from 'canvas-confetti';

interface QuizProps {
  theme: ThemeOption;
  onBack: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ theme, onBack }) => {
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.id]);

  const fetchData = async () => {
    setLoading(true);
    setIsFinished(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    const data = await generateWordList(theme.id);
    // Shuffle words to make it random? The API usually returns random enough, but let's stick to API order for now.
    setWords(data);
    setLoading(false);
  };

  const handleOptionClick = (word: WordItem) => {
    if (selectedOption) return; // Prevent double click

    const correctWord = words[currentQuestionIndex];
    const correct = word.character === correctWord.character;
    
    setSelectedOption(word.character);
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      if (currentQuestionIndex < words.length - 1) {
        setCurrentQuestionIndex(p => p + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setIsFinished(true);
        confetti({
          particleCount: 300,
          spread: 120,
          startVelocity: 40,
        });
      }
    }, 1500);
  };

  // Generate 3 options including the correct one
  const getOptions = () => {
    if (words.length === 0) return [];
    const current = words[currentQuestionIndex];
    const others = words.filter(w => w.character !== current.character);
    // Shuffle others and take 2
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 2);
    const options = [current, ...shuffledOthers].sort(() => 0.5 - Math.random());
    return options;
  };

  const currentOptions = !loading && !isFinished ? getOptions() : [];

  return (
    <div className="h-full flex flex-col p-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="secondary" size="sm" onClick={onBack} className="!rounded-full w-12 h-12 !p-0">
          <ArrowLeft size={24} />
        </Button>
        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white font-bold">
            <Star className="text-yellow-300 fill-yellow-300" />
            <span>{score} / {words.length}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center text-white animate-pulse">
            <div className="text-6xl mb-4">🎲</div>
            <div className="text-2xl font-bold">准备游戏...</div>
          </div>
        ) : isFinished ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl animate-bounce-slow max-w-md w-full">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-4xl font-chinese font-bold text-slate-800 mb-2">太棒了!</h2>
            <p className="text-xl text-slate-600 mb-6">Score: {score} / {words.length}</p>
            <div className="flex flex-col gap-3">
              <Button onClick={fetchData} variant="primary" className="w-full">
                <RefreshCw size={20} /> 再玩一次 (Play Again)
              </Button>
              <Button onClick={onBack} variant="secondary" className="w-full">
                 返回主页 (Home)
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h3 className="text-white text-2xl font-bold mb-4">哪一个是... (Which one is...)</h3>
              <div className="bg-white rounded-3xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300 inline-block">
                <div className="text-8xl animate-pulse-slow">{words[currentQuestionIndex].emoji}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentOptions.map((opt) => {
                let btnVariant: 'secondary' | 'success' | 'danger' = 'secondary';
                if (selectedOption) {
                  if (opt.character === words[currentQuestionIndex].character) {
                    btnVariant = 'success';
                  } else if (opt.character === selectedOption) {
                    btnVariant = 'danger';
                  }
                }

                return (
                  <Button
                    key={opt.character}
                    variant={btnVariant}
                    size="lg"
                    className="w-full !text-4xl !py-6 font-chinese relative overflow-hidden"
                    onClick={() => handleOptionClick(opt)}
                    disabled={!!selectedOption}
                  >
                     {opt.character}
                     <span className="text-sm absolute bottom-1 right-3 opacity-50 font-sans font-normal">{opt.pinyin}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};