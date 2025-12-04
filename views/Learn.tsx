import React, { useState, useEffect } from 'react';
import { WordItem, ThemeOption } from '../types';
import { WordCard } from '../components/WordCard';
import { Button } from '../components/Button';
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { generateWordList, generateSpeech } from '../services/geminiService';
import { decodeAudioData, playAudioBuffer } from '../utils/audioUtils';

interface LearnProps {
  theme: ThemeOption;
  onBack: () => void;
}

export const Learn: React.FC<LearnProps> = ({ theme, onBack }) => {
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Init Audio Context on mount (requires user interaction to unlock usually, handled by button clicks later if needed, 
    // but initializing here is good practice for state prep)
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    setAudioCtx(ctx);
    
    fetchData();

    return () => {
        if(ctx.state !== 'closed') ctx.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.id]);

  const fetchData = async () => {
    setLoading(true);
    const data = await generateWordList(theme.id);
    setWords(data);
    setCurrentIndex(0);
    setLoading(false);
  };

  const handlePlayAudio = async (text: string) => {
    if (!audioCtx) return;
    
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    setAudioLoading(true);
    const base64 = await generateSpeech(text);
    if (base64) {
      const buffer = await decodeAudioData(base64, audioCtx);
      playAudioBuffer(audioCtx, buffer);
    }
    setAudioLoading(false);
  };

  const nextCard = () => {
    if (currentIndex < words.length - 1) setCurrentIndex(p => p + 1);
  };

  const prevCard = () => {
    if (currentIndex > 0) setCurrentIndex(p => p - 1);
  };

  return (
    <div className="h-full flex flex-col p-4 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="secondary" size="sm" onClick={onBack} className="!rounded-full w-12 h-12 !p-0">
          <ArrowLeft size={24} />
        </Button>
        <h2 className="text-3xl font-chinese font-bold text-white drop-shadow-md">
           {theme.icon} {theme.name}
        </h2>
        <div className="w-12"></div> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {loading ? (
          <div className="flex flex-col items-center text-white animate-pulse">
            <div className="text-6xl mb-4">🪄</div>
            <div className="text-2xl font-bold">魔法正在生成...</div>
            <div className="text-sm opacity-75">(Gemini is creating your cards)</div>
          </div>
        ) : words.length === 0 ? (
           <div className="text-center bg-white/20 p-8 rounded-3xl backdrop-blur-sm">
             <p className="text-white text-xl font-bold mb-4">Oh no! No magic words found.</p>
             <Button onClick={fetchData} variant="secondary"><RefreshCw size={20} /> Try Again</Button>
           </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-8">
            <WordCard 
              word={words[currentIndex]} 
              onPlayAudio={handlePlayAudio}
              isAudioLoading={audioLoading}
            />
            
            <div className="flex items-center gap-6">
              <Button 
                variant="secondary" 
                onClick={prevCard} 
                disabled={currentIndex === 0}
                className="!rounded-full w-16 h-16 !p-0"
              >
                <ChevronLeft size={32} />
              </Button>
              
              <div className="text-white font-bold text-xl bg-black/20 px-4 py-2 rounded-xl">
                {currentIndex + 1} / {words.length}
              </div>

              <Button 
                variant="secondary" 
                onClick={nextCard} 
                disabled={currentIndex === words.length - 1}
                className="!rounded-full w-16 h-16 !p-0"
              >
                <ChevronRight size={32} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};