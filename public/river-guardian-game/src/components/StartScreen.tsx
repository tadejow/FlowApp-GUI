


import React, { useState, useEffect } from 'react';
import { LanguageSelector, useLocalization } from '../i18n/LanguageContext';
import { audioManager } from '../utils/audio';
import { requestFullscreen } from '../utils/fullscreen';

interface StartScreenProps {
    onStart: () => void;
    onHowToPlay: () => void;
}

const MuteButton: React.FC = () => {
    const [isMuted, setIsMuted] = useState(audioManager.getIsMuted());

    const handleToggleMute = () => {
        audioManager.playSfx('click');
        const muted = audioManager.toggleMute();
        setIsMuted(muted);
    };

    return (
        <button onClick={handleToggleMute} className="w-12 h-12 bg-black/20 backdrop-blur-md p-1 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10">
             {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l4-4m-4 0l4 4" />
                </svg>
             ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
             )}
        </button>
    );
};


const GlassButton: React.FC<{onClick: () => void, children: React.ReactNode, className?: string, glowColor?: string, disabled?: boolean}> = ({ onClick, children, className, glowColor, disabled }) => {
    const shadowStyle = !disabled && glowColor ? { '--glow-color': glowColor } as React.CSSProperties : {};
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={shadowStyle}
            className={`bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-100
            ${!disabled && glowColor ? 'shadow-[0_0_8px_var(--glow-color)] hover:shadow-[0_0_12px_var(--glow-color),inset_0_1px_4px_rgba(255,255,255,0.4)]' : ''}
            hover:bg-white/20 hover:border-white/50
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none ${className}`}
        >
            {children}
        </button>
    );
};

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onHowToPlay }) => {
    const { t } = useLocalization();

    useEffect(() => {
        // Prepare the music as soon as the component loads.
        // The audio manager will handle initialization.
        audioManager.playMusic('menu');
    }, []);

    const handleInteraction = (callback: () => void) => {
        return () => {
            requestFullscreen();
            // PlaySfx will handle resuming the audio context on the first interaction.
            audioManager.playSfx('click');
            callback();
        };
    };

    return (
        <div 
            className="w-full h-full bg-[linear-gradient(45deg,_#0c3483,_#0a192f,_#0c3483)] bg-[size:200%_200%]"
            style={{ animation: 'animated-gradient 15s ease infinite' }}
        >
             <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 800%22%3E%3Cg fill=%22none%22 stroke=%22%2322d3ee%22 stroke-width=%221%22%3E%3Cpath d=%22M-500 750c0 0 160-110 320-110s320 110 320 110-160 110-320 110-320-110-320-110z%22/%3E%3Cpath d=%22M-500 550c0 0 160-110 320-110s320 110 320 110-160 110-320 110-320-110-320-110z%22/%3E%3Cpath d=%22M-500 350c0 0 160-110 320-110s320 110 320 110-160 110-320 110-320-110-320-110z%22/%3E%3Cpath d=%22M-500 150c0 0 160-110 320-110s320 110 320 110-160 110-320 110-320-110-320-110z%22/%3E%3C/g%3E%3C/svg%3E')" }}></div>
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative z-10">
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <MuteButton />
                    <LanguageSelector />
                </div>
                
                <h1 className="text-5xl sm:text-6xl break-words font-bold text-white drop-shadow-lg" style={{ fontFamily: "'Arial Black', sans-serif", textShadow: '0 2px 2px #00000040, 0 0 25px #22d3ee, 0 0 8px #ffffff' }}>
                     <span className="text-cyan-300">{t('title').split(' ')[0]}</span> {t('title').split(' ')[1]}
                </h1>
                <p className="mt-4 text-lg text-cyan-100/90">{t('subtitle')}</p>

                <div className="mt-20 flex flex-col space-y-5 w-full max-w-xs">
                    <GlassButton onClick={handleInteraction(onStart)} className="py-4 text-2xl" glowColor="#4ade80">
                        {t('play')}
                    </GlassButton>
                    <GlassButton onClick={handleInteraction(onHowToPlay)} className="py-3 text-xl" glowColor="#38bdf8">
                        {t('howToPlay')}
                    </GlassButton>
                     <GlassButton onClick={() => {}} className="py-3 text-xl" glowColor="#a855f7" disabled={true}>
                        {t('ranking')}
                    </GlassButton>
                </div>
            </div>
        </div>
    );
};