import React, { useState } from 'react';
import { Home } from './views/Home';
import { Learn } from './views/Learn';
import { Quiz } from './views/Quiz';
import { AppView, ThemeOption } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption | null>(null);

  const handleThemeSelect = (theme: ThemeOption, mode: 'learn' | 'quiz') => {
    setSelectedTheme(theme);
    setCurrentView(mode === 'learn' ? AppView.LEARN : AppView.QUIZ);
  };

  const handleBack = () => {
    setCurrentView(AppView.HOME);
    setSelectedTheme(null);
  };

  return (
    <main className="h-screen w-full relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
         <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl"></div>
      </div>

      {currentView === AppView.HOME && (
        <Home onThemeSelect={handleThemeSelect} />
      )}
      
      {currentView === AppView.LEARN && selectedTheme && (
        <Learn theme={selectedTheme} onBack={handleBack} />
      )}

      {currentView === AppView.QUIZ && selectedTheme && (
        <Quiz theme={selectedTheme} onBack={handleBack} />
      )}
    </main>
  );
}

export default App;