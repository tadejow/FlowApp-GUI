

import React, { useState } from 'react';
import { useLocalization, type LocaleKey } from '../i18n/LanguageContext';
import { audioManager } from '../utils/audio';
import { ObjectType } from '../types';
import { OBJECT_GRAPHICS_URLS } from '../constants';
import { requestFullscreen } from '../utils/fullscreen';

interface HowToPlayScreenProps {
    onBack: () => void;
}

const getObjectName = (type: ObjectType): LocaleKey => {
    return `object_${ObjectType[type].toLowerCase()}` as LocaleKey;
}

const ObjectDisplay: React.FC<{ types: ObjectType[], categoryColor: string }> = ({ types, categoryColor }) => {
    const { t } = useLocalization();
    return (
        <div className="grid grid-cols-3 gap-x-2 gap-y-2 w-full h-full content-center">
            {types.map(type => (
                <div key={type} className="flex flex-col items-center">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-lg bg-black/20 border-2 ${categoryColor}`}>
                        <img src={OBJECT_GRAPHICS_URLS[type]} alt={ObjectType[type]} className="w-14 h-14 object-contain" />
                    </div>
                    <span className="mt-1 text-xs font-semibold">{t(getObjectName(type))}</span>
                </div>
            ))}
        </div>
    );
};

const trashTypes = [ObjectType.Bottle, ObjectType.Can, ObjectType.Bag, ObjectType.OilSpill, ObjectType.Barrel, ObjectType.Microplastic];
const organismTypes = [ObjectType.Fish, ObjectType.Spawn, ObjectType.Plant, ObjectType.Frog];
const neutralTypes = [ObjectType.Leaf, ObjectType.Branch];

const slidesData: { titleKey: LocaleKey; contentKey: LocaleKey; icon: React.ReactNode }[] = [
    { 
        titleKey: 'howToPlay_slide1_title', 
        contentKey: 'howToPlay_slide1_content',
        icon: <ObjectDisplay types={trashTypes} categoryColor="border-cyan-400/50" />
    },
    { 
        titleKey: 'howToPlay_slide2_title', 
        contentKey: 'howToPlay_slide2_content',
        icon: <ObjectDisplay types={organismTypes} categoryColor="border-red-400/50" />
    },
    { 
        titleKey: 'howToPlay_slide3_title', 
        contentKey: 'howToPlay_slide3_content',
        icon: <ObjectDisplay types={neutralTypes} categoryColor="border-gray-400/50" />
    },
    { 
        titleKey: 'howToPlay_slide4_title', 
        contentKey: 'howToPlay_slide4_content',
        icon: (
            <div className="w-full h-full flex items-center justify-center text-blue-300">
                 <svg className="w-24 h-24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <circle cx="12" cy="12" r="7"></circle>
                    <path d="M12 2v20"></path>
                    <path d="M2 12h20"></path>
                    <path d="m4.93 4.93 14.14 14.14"></path>
                    <path d="m4.93 19.07 14.14-14.14"></path>
                </svg>
            </div>
        )
    },
    { 
        titleKey: 'howToPlay_slide5_title', 
        contentKey: 'howToPlay_slide5_content',
        icon: (
            <div className="w-full h-full flex items-center justify-center text-cyan-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11.5,5.5C11.5,5.5 13,7 15,7C17,7 18.5,5.5 18.5,5.5V7C18.5,7 17,8.5 15,8.5C13,8.5 11.5,7 11.5,7V5.5M5.5,11.5C5.5,11.5 7,13 9,13C11,13 12.5,11.5 12.5,11.5V13C12.5,13 11,14.5 9,14.5C7,14.5 5.5,13 5.5,13V11.5M11.5,17.5C11.5,17.5 13,19 15,19C17,19 18.5,17.5 18.5,17.5V19C18.5,19 17,20.5 15,20.5C13,20.5 11.5,19 11.5,19V17.5Z" />
                </svg>
            </div>
        )
    },
];

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ onBack }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { t } = useLocalization();

    const nextSlide = () => {
        audioManager.playSfx('click');
        setCurrentSlide(s => (s + 1) % slidesData.length);
    }
    const prevSlide = () => {
        audioManager.playSfx('click');
        setCurrentSlide(s => (s - 1 + slidesData.length) % slidesData.length);
    }

    const slide = slidesData[currentSlide];

    return (
        <div className="w-full h-full bg-gray-800/80 backdrop-blur-sm flex flex-col p-6 text-center">
            <h1 className="text-4xl font-bold text-cyan-300 mb-4 drop-shadow-lg" style={{ textShadow: '0 0 10px #22d3ee' }}>{t('howToPlay')}</h1>
            
            <div className="flex-grow flex flex-col items-center justify-between bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl min-h-0">
                <h2 className="text-2xl font-bold text-yellow-300 flex-shrink-0">{t(slide.titleKey)}</h2>
                <div className="flex-grow flex items-center justify-center w-full my-2 min-h-0">{slide.icon}</div>
                <p className="text-base text-gray-200 flex-shrink-0">{t(slide.contentKey)}</p>
            </div>
            
            <div className="flex justify-between items-center mt-4">
                <button onClick={prevSlide} className="px-4 py-2 bg-black/20 rounded-lg hover:bg-black/40 text-2xl transition-colors">{'<'}</button>
                <div className="flex space-x-2">
                    {slidesData.map((_, index) => {
                        const handleDotClick = () => {
                             audioManager.playSfx('click');
                             setCurrentSlide(index);
                        }
                        return <div key={index} onClick={handleDotClick} className={`w-3 h-3 rounded-full transition-all cursor-pointer ${index === currentSlide ? 'bg-cyan-400 w-6' : 'bg-gray-600'}`}></div>
                    })}
                </div>
                <button onClick={nextSlide} className="px-4 py-2 bg-black/20 rounded-lg hover:bg-black/40 text-2xl transition-colors">{'>'}</button>
            </div>

            <button 
                onClick={() => { requestFullscreen(); audioManager.playSfx('click'); onBack(); }}
                className="w-full mt-6 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all transform hover:scale-105 hover:bg-white/20 active:scale-100"
            >
                {t('backToMenu')}
            </button>
        </div>
    );
};