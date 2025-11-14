





import React from 'react';
import { PowerUp } from '../types';
import { useLocalization } from '../i18n/LanguageContext';
import { audioManager } from '../utils/audio';
import { requestFullscreen } from '../utils/fullscreen';

interface HUDProps {
    score: number;
    survivalTime: number;
    multiplier: number;
    powerUps: { [key in PowerUp]: number };
    riverHealth: number;
    onActivatePowerUp: (powerUp: PowerUp) => void;
    onPause: () => void;
}

const PowerUpBubble: React.FC<{ name: string; count: number; onClick: () => void; children: React.ReactNode; glowColor: string; }> = ({ name, count, onClick, children, glowColor }) => {
    const disabled = count <= 0;
    const style = !disabled ? { '--glow-color': glowColor } as React.CSSProperties : {};
    
    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={onClick}
                disabled={disabled}
                style={style}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all transform border-2
                ${disabled 
                    ? 'bg-gray-700/50 border-gray-500/50 cursor-not-allowed' 
                    : 'bg-white/10 border-white/30 backdrop-blur-md active:scale-95 ' +
                      'shadow-lg shadow-[0_0_8px_var(--glow-color)] ' +
                      'hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_12px_var(--glow-color),inset_0_1px_4px_rgba(255,255,255,0.4)]'
                }`}
            >
                {children}
                {!disabled && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white/80">
                        {count}
                    </span>
                )}
            </button>
            <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/90 drop-shadow-md">{name}</span>
        </div>
    );
};


export const HUD: React.FC<HUDProps> = ({ score, survivalTime, multiplier, powerUps, riverHealth, onActivatePowerUp, onPause }) => {
    const { t } = useLocalization();
    const minutes = Math.floor(survivalTime / 60);
    const seconds = survivalTime % 60;

    const handlePauseClick = () => {
        requestFullscreen();
        audioManager.playSfx('click');
        onPause();
    }

    let multiplierColor = 'text-white';
    let multiplierShadowColor = 'transparent';

    switch (multiplier) {
        case 2:
            multiplierColor = 'text-green-400';
            multiplierShadowColor = '#34d399';
            break;
        case 3:
            multiplierColor = 'text-yellow-400';
            multiplierShadowColor = '#facc15';
            break;
        case 4:
            multiplierColor = 'text-orange-400';
            multiplierShadowColor = '#fb923c';
            break;
        case 5:
            multiplierColor = 'text-red-500 animate-pulse';
            multiplierShadowColor = '#ef4444';
            break;
    }

    const multiplierShadow = multiplier > 1 ? { textShadow: `0 0 8px ${multiplierShadowColor}` } : {};

    const riverHealthPercentage = Math.max(0, riverHealth);
    const healthBarColor = riverHealthPercentage > 60 ? 'from-cyan-400 to-blue-500' : riverHealthPercentage > 30 ? 'from-yellow-400 to-orange-500' : 'from-red-500 to-rose-600';
    const healthBarShadow = riverHealthPercentage > 60 ? '#67e8f9' : riverHealthPercentage > 30 ? '#facc15' : '#ef4444';

    return (
        <div className="absolute inset-0 pointer-events-none text-white p-4 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex justify-between items-center bg-black/20 backdrop-blur-lg p-2 rounded-xl border border-white/20 shadow-2xl">
                <div className="text-center w-1/4">
                    <div className="text-xs uppercase text-gray-300/80 tracking-wider">
                        {t('time')}
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <div className="text-xl font-bold tracking-wider">{`${minutes}:${seconds.toString().padStart(2, '0')}`}</div>
                    </div>
                </div>
                <div className="text-center w-1/2 border-x border-white/20">
                     <div className="text-xs uppercase text-gray-300/80 tracking-wider">{t('score')}</div>
                    <div className="text-3xl font-bold tracking-wider" style={{ textShadow: '0 0 10px #22d3ee' }}>{score.toLocaleString()}</div>
                </div>
                <div className="text-center w-1/4">
                    <div className="text-xs uppercase text-gray-300/80 tracking-wider">{t('multiplier')}</div>
                    <div className={`text-2xl font-bold ${multiplierColor}`} style={multiplierShadow}>x{multiplier}</div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="w-full">
                 <div className="flex justify-between items-end">
                    {/* Pause */}
                    <button 
                        onClick={handlePauseClick} 
                        className="pointer-events-auto w-14 h-14 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/10 active:scale-95 transition-all hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_12px_rgba(103,232,249,0.4),inset_0_1px_4px_rgba(255,255,255,0.4)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                        </svg>
                    </button>
                    
                    {/* Power-ups */}
                    <div className="flex space-x-4 pointer-events-auto">
                        <PowerUpBubble name={t('net')} count={powerUps.net} onClick={() => onActivatePowerUp('net')} glowColor="#38bdf8">
                             <svg className="h-9 w-9" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <circle cx="12" cy="12" r="7"></circle>
                                <path d="M12 2v20"></path>
                                <path d="M2 12h20"></path>
                                <path d="m4.93 4.93 14.14 14.14"></path>
                                <path d="m4.93 19.07 14.14-14.14"></path>
                            </svg>
                        </PowerUpBubble>
                    </div>
                </div>
                {/* River Health Bar */}
                <div className="mt-4 h-3 w-full bg-black/30 rounded-full overflow-hidden border border-white/20 shadow-inner">
                    <div 
                        className={`h-full bg-gradient-to-r ${healthBarColor} transition-all duration-500 relative`}
                        style={{ width: `${riverHealthPercentage}%`, boxShadow: `0 0 10px ${healthBarShadow}` }}
                    >
                         <div className="absolute top-0 left-0 h-full w-full bg-white/20 opacity-50"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};