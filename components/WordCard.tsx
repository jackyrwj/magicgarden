import React, { useState } from 'react';
import { WordItem } from '../types';
import { Volume2, Sparkles } from 'lucide-react';

interface WordCardProps {
  word: WordItem;
  onPlayAudio: (text: string) => void;
  isAudioLoading: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onPlayAudio, isAudioLoading }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-72 h-96 cursor-pointer perspective-1000 group mx-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white border-4 border-yellow-400 rounded-3xl shadow-xl flex flex-col items-center justify-center p-6"
             style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-8xl mb-4 transform group-hover:scale-110 transition-transform">{word.emoji}</div>
          <div className="text-8xl font-chinese font-bold text-slate-800">{word.character}</div>
          <div className="mt-4 text-slate-400 text-sm font-bold flex items-center gap-1">
             <Sparkles size={16} /> 点击翻看 (Tap to Flip)
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute w-full h-full backface-hidden bg-sky-100 border-4 border-sky-400 rounded-3xl shadow-xl flex flex-col items-center justify-between p-6 rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
           <div className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="text-3xl font-bold text-sky-600 mb-1">{word.pinyin}</div>
            <div className="text-6xl font-chinese font-bold text-slate-800 mb-2">{word.character}</div>
            <div className="text-xl text-slate-600 font-bold bg-white/50 px-3 py-1 rounded-full">{word.english}</div>
            
            <div className="mt-6 w-full bg-white/60 p-3 rounded-xl text-center">
              <p className="text-slate-700 text-lg leading-relaxed font-chinese">{word.sentence}</p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio(word.character);
            }}
            disabled={isAudioLoading}
            className="mt-4 w-full bg-orange-400 hover:bg-orange-300 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-bold shadow-lg active:scale-95 transition-transform"
          >
            <Volume2 size={24} />
            {isAudioLoading ? '...' : '读一读 (Read)'}
          </button>
        </div>
      </div>
    </div>
  );
};