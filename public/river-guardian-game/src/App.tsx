


import React, { useState, useCallback } from 'react';
import { GameScreen } from './components/GameScreen';
import { StartScreen } from './components/StartScreen';
import { HowToPlayScreen } from './components/HowToPlayScreen';
import { ScoreScreen } from './components/ScoreScreen';
import { GameResult } from './types';
import { LanguageProvider } from './i18n/LanguageContext';
import { audioManager } from './utils/audio';

export type Screen = 'start' | 'howToPlay' | 'game' | 'score';

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('start');
    const [lastResult, setLastResult] = useState<GameResult | null>(null);

    const handleGameStart = useCallback(() => {
        audioManager.playSfx('transition');
        setScreen('game');
    }, []);

    const handleShowHowToPlay = useCallback(() => {
        audioManager.playSfx('transition');
        setScreen('howToPlay');
    }, []);
    
    const handleBackToMenu = useCallback(() => {
        audioManager.playSfx('transition');
        audioManager.playMusic('menu');
        setScreen('start');
    }, []);

    const handleGameEnd = useCallback((result: GameResult) => {
        setLastResult(result);
        audioManager.playSfx('gameOver');
        audioManager.stopMusic();
        setTimeout(() => {
            audioManager.playMusic('menu');
        }, 1000);
        setScreen('score');
    }, []);

    const renderScreen = () => {
        switch (screen) {
            case 'start':
                return <StartScreen onStart={handleGameStart} onHowToPlay={handleShowHowToPlay} />;
            case 'howToPlay':
                return <HowToPlayScreen onBack={handleBackToMenu} />;
            case 'game':
                return <GameScreen onGameEnd={handleGameEnd} onBackToMenu={handleBackToMenu} />;
            case 'score':
                return <ScoreScreen result={lastResult!} onPlayAgain={handleGameStart} onMenu={handleBackToMenu} />;
            default:
                return <StartScreen onStart={handleGameStart} onHowToPlay={handleShowHowToPlay} />;
        }
    };

    return (
        <LanguageProvider>
            <div className="h-dvh w-screen bg-[#0a192f] flex items-center justify-center font-sans">
                <div className="relative aspect-[1/2] h-full w-auto max-w-full bg-gray-900 overflow-hidden sm:rounded-2xl sm:border-4 sm:border-gray-700 shadow-2xl">
                    {renderScreen()}
                </div>
            </div>
        </LanguageProvider>
    );
};

export default App;