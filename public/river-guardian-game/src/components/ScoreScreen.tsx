


import React, { useMemo } from 'react';
import { GameResult } from '../types';
import { EDUCATIONAL_FACTS } from '../constants';
import { useLocalization } from '../i18n/LanguageContext';
import { audioManager } from '../utils/audio';
import { requestFullscreen } from '../utils/fullscreen';

interface ScoreScreenProps {
    result: GameResult;
    onPlayAgain: () => void;
    onMenu: () => void;
}

export const ScoreScreen: React.FC<ScoreScreenProps> = ({ result, onPlayAgain, onMenu }) => {
    const { lang, t } = useLocalization();

    const fact = useMemo(() => {
        const facts = EDUCATIONAL_FACTS[lang] || EDUCATIONAL_FACTS['en'];
        return facts[Math.floor(Math.random() * facts.length)];
    }, [lang]);

    const survivalMinutes = Math.floor(result.survivalTime / 60);
    const survivalSeconds = result.survivalTime % 60;

    return (
        <div className="w-full h-full bg-gray-800/80 backdrop-blur-md flex flex-col p-6 text-center">
            <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-lg" style={{ textShadow: '0 0 15px #facc15' }}>{t('roundOver')}</h1>
            
            <div className="my-6 p-6 bg-black/20 backdrop-blur-lg rounded-xl shadow-inner border border-white/20">
                <p className="text-lg text-gray-400">{t('finalScore')}</p>
                <p className="text-6xl font-bold text-white my-2" style={{ textShadow: '0 0 15px #22d3ee, 0 0 25px #22d3ee' }}>
                    {result.score.toLocaleString()}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6 text-left">
                    <div className="bg-green-600/20 p-3 rounded-lg border border-green-400/30 shadow-md">
                        <p className="text-sm text-green-200">{t('trashCollected')}</p>
                        <p className="text-2xl font-semibold text-green-300">{result.trashCollected}</p>
                    </div>
                    <div className="bg-red-600/20 p-3 rounded-lg border border-red-400/30 shadow-md">
                        <p className="text-sm text-red-200">{t('organismsHit')}</p>
                        <p className="text-2xl font-semibold text-red-300">{result.organismsHit}</p>
                    </div>
                     <div className="bg-cyan-600/20 p-3 rounded-lg border border-cyan-400/30 shadow-md col-span-2">
                        <p className="text-sm text-cyan-200">{t('survivalTime')}</p>
                        <p className="text-2xl font-semibold text-cyan-300 text-center">{`${survivalMinutes}:${survivalSeconds.toString().padStart(2, '0')}`}</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center bg-blue-900/20 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-xl">
                <h3 className="text-xl font-bold text-cyan-300">{t('ecoFact')}</h3>
                <h4 className="text-lg font-semibold mt-2 text-yellow-200">{fact.title}</h4>
                <p className="text-base text-gray-200 mt-1">{fact.content}</p>
            </div>

            <div className="mt-6 flex flex-col space-y-4 w-full">
                <button 
                    onClick={() => { requestFullscreen(); audioManager.playSfx('click'); onPlayAgain(); }}
                    className="bg-green-500/80 backdrop-blur-md hover:bg-green-500 border border-green-300/60 text-white font-bold py-4 px-6 rounded-xl text-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-100 shadow-[0_0_15px_rgba(74,222,128,0.5)] hover:shadow-[0_0_20px_rgba(74,222,128,0.7),inset_0_1px_4px_rgba(255,255,255,0.4)]"
                >
                    {t('playAgain')}
                </button>
                <button 
                    onClick={() => { requestFullscreen(); audioManager.playSfx('click'); onMenu(); }}
                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 hover:border-white/40 text-white font-bold py-2 px-6 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 active:scale-100"
                >
                    {t('mainMenu')}
                </button>
            </div>
        </div>
    );
};