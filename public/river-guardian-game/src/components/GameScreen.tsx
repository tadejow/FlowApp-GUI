

import React, { useState, useCallback, useRef } from 'react';
import { GameResult, PowerUp, DebugInfo } from '../types';
import { GameCanvas, GameState } from './GameCanvas';
import { HUD } from './HUD';
import { useLocalization } from '../i18n/LanguageContext';
import { DebugOverlay } from './DebugOverlay';
import { audioManager } from '../utils/audio';
import { requestFullscreen } from '../utils/fullscreen';

interface GameScreenProps {
    onGameEnd: (result: GameResult) => void;
    onBackToMenu: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameEnd, onBackToMenu }) => {
    const { t } = useLocalization();
    const [score, setScore] = useState(0);
    const [survivalTime, setSurvivalTime] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [riverHealth, setRiverHealth] = useState(100);
    const [powerUps, setPowerUps] = useState<{ [key in PowerUp]: number }>({ net: 2 });
    const [isPaused, setIsPaused] = useState(false);
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

    const activatePowerUpRef = useRef<(powerUp: PowerUp) => void>(() => {});

    const handlePowerUpUsed = useCallback((powerUp: PowerUp) => {
        setPowerUps(prev => ({ ...prev, [powerUp]: Math.max(0, prev[powerUp] - 1) }));
    }, []);

    const handlePowerUpGained = useCallback((powerUp: PowerUp) => {
        if (powerUp === 'net') {
            setPowerUps(prev => ({ ...prev, net: prev.net + 1 }));
        }
    }, []);

    const handleActivatePowerUp = (powerUp: PowerUp) => {
        if (powerUps[powerUp] > 0 && !isPaused) {
            requestFullscreen();
            activatePowerUpRef.current(powerUp);
        }
    };
    
    const togglePause = () => {
        setIsPaused(p => !p);
    };

    const handleStateUpdate = useCallback((state: GameState) => {
        setScore(state.score);
        setSurvivalTime(state.survivalTime);
        setMultiplier(state.multiplier);
        setRiverHealth(state.riverHealth);
    }, []);

    const handleDebugUpdate = useCallback((info: DebugInfo) => {
        setDebugInfo(info);
    }, []);

    return (
        <div className="w-full h-full bg-blue-800 relative">
            <GameCanvas 
                onGameEnd={onGameEnd}
                onStateUpdate={handleStateUpdate}
                onDebugUpdate={handleDebugUpdate}
                activatePowerUpRef={activatePowerUpRef}
                onPowerUpGained={handlePowerUpGained}
                onPowerUpUsed={handlePowerUpUsed}
                isPaused={isPaused}
            />
            {/* {debugInfo && <DebugOverlay debugInfo={debugInfo} />} */}
            <HUD 
                score={score}
                survivalTime={survivalTime}
                multiplier={multiplier}
                powerUps={powerUps}
                riverHealth={riverHealth}
                onActivatePowerUp={handleActivatePowerUp}
                onPause={togglePause}
            />
            {isPaused && (
                 <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50">
                    <h2 className="text-6xl font-bold text-cyan-300 animate-pulse drop-shadow-lg" style={{ textShadow: '0 0 15px #22d3ee' }}>{t('paused')}</h2>
                    <button 
                        onClick={() => {
                            requestFullscreen();
                            audioManager.playSfx('click');
                            togglePause();
                        }}
                        className="mt-8 bg-green-500/20 backdrop-blur-md border border-green-400/50 text-white font-bold py-4 px-10 rounded-xl text-2xl shadow-lg shadow-[0_0_8px_rgba(74,222,128,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-100 hover:bg-green-500/30 hover:border-green-400/80 hover:shadow-[0_0_12px_rgba(74,222,128,0.7),inset_0_1px_4px_rgba(255,255,255,0.4)]"
                    >
                        {t('resume')}
                    </button>
                    <button
                        onClick={() => {
                            requestFullscreen();
                            audioManager.playSfx('click');
                            onBackToMenu();
                        }}
                        className="mt-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-lg transition-all transform hover:scale-105 active:scale-100 hover:bg-white/20"
                    >
                        {t('mainMenu')}
                    </button>
                </div>
            )}
        </div>
    );
};