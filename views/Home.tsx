import React from 'react';
import { THEMES, ThemeOption } from '../types';
import { Button } from '../components/Button';
import { Gamepad2, GraduationCap } from 'lucide-react';

interface HomeProps {
  onThemeSelect: (theme: ThemeOption, mode: 'learn' | 'quiz') => void;
}

export const Home: React.FC<HomeProps> = ({ onThemeSelect }) => {
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 overflow-y-auto">
      <header className="text-center my-8 animate-bounce-slow">
        <h1 className="text-5xl md:text-7xl font-chinese text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2">
          魔法识字花园
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-bold">Magic Word Garden</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {THEMES.map((theme) => (
          <div key={theme.id} className={`${theme.color} rounded-3xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center border-4 border-white/30`}>
            <div className="text-6xl mb-4 drop-shadow-md">{theme.icon}</div>
            <h2 className="text-3xl font-chinese text-white font-bold mb-6 drop-shadow-sm text-center">
              {theme.name}
            </h2>
            
            <div className="flex gap-3 w-full">
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1"
                onClick={() => onThemeSelect(theme, 'learn')}
              >
                <GraduationCap size={20} />
                学习
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="flex-1 bg-black/20 hover:bg-black/30 text-white border-2 border-transparent hover:border-white/50"
                onClick={() => onThemeSelect(theme, 'quiz')}
              >
                <Gamepad2 size={20} />
                游戏
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};