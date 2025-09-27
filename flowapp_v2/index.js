
import React, { useState, useEffect, StrictMode, useRef, useLayoutEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

const translations = {
  en: {
    splashSubtitle: "The unique experience of the Mandau River",
    goButton: "Go with the Flow",
    loginTitle: "Choose your nickname",
    loginPlaceholder: "Your nickname...",
    loginButton: "Start Game",
    station1Title: "Station I: Bridge over the Mandau",
    station1Text: "You are standing on the Bridge over the Mandau. This river winds through three countries and holds many stories. Unfortunately, it also holds some trash. Your first task is to help clean this section of the river. Play the game to make a difference!",
    station2Title: "Station II: Water Flow Simulation",
    station2Text: "Water is a dynamic force. Below, you can see two simulations of water flow. The first shows a 2D representation, helpful for understanding surface movement. The second is a 3D simulation, which gives a better sense of volume and depth. Observe how water interacts with its environment in both models.",
    station3Title: "Station III: Falling Drop",
    station3Text: "Guide the falling drop safely to the ground, avoiding obstacles along the way. Play the game to test your reflexes!",
    station4Title: "Station IV: Hex Connect",
    station4Text: "Connect the hexagonal pipes to guide the water from the source to the destination. A puzzle of logic and flow!",
    station5Title: "Station V: Ecosystem Impact",
    station5Text: "The river's ecosystem is a delicate balance. Even fun activities can have an impact. Race your duck down the river to see how objects and flow interact! Play the game to learn more.",
    slider1Label: "How far is the source of the water from city?",
    simulationTitle: "Simulation Results",
    nextStationButton: (station) => `Next Station ${station}`,
    viewSummaryButton: "View Summary",
    pointsScored: "Points Scored:",
    summaryFeedback: (nickname) => `Congratulations, ${nickname}! Your decisions show a great understanding of river dynamics.`,
    ariaGoToApp: "Go to the FlowApp application",
    ariaEnterNickname: "Enter your nickname",
    ariaReturnToStart: "Return to start screen",
    ariaStationSelection: "Station selection",
    ariaStation: (num) => `Station ${num}`,
    playGameButton: (gameName) => `Play ${gameName}`,
    yourScore: "Your score:",
    closeGame: "Close game",
    fullscreen: "Fullscreen",
    enterFullscreen: "Enter fullscreen",
    exitFullscreen: "Exit fullscreen",
  },
  pl: {
    splashSubtitle: "Wyjątkowe doświadczenie rzeki Mandau",
    goButton: "Płyń z prądem",
    loginTitle: "Wybierz swój nick",
    loginPlaceholder: "Twój nick...",
    loginButton: "Rozpocznij grę",
    station1Title: "Stacja I: Most na Mandau",
    station1Text: "Stoisz na moście nad Mandau. Ta rzeka wije się przez trzy kraje i kryje w sobie wiele historii. Niestety, kryje też trochę śmieci. Twoim pierwszym zadaniem jest pomoc w oczyszczeniu tego odcinka rzeki. Zagraj w grę, aby coś zmienić!",
    station2Title: "Stacja II: Symulacja przepływu wody",
    station2Text: "Woda to dynamiczna siła. Poniżej widać dwie symulacje przepływu wody. Pierwsza pokazuje reprezentację 2D, pomocną w zrozumieniu ruchu powierzchniowego. Druga to symulacja 3D, która daje lepsze poczucie objętości i głębi. Obserwuj, jak woda oddziałuje ze swoim otoczeniem w obu modelach.",
    station3Title: "Stacja III: Spadająca Kropla",
    station3Text: "Poprowadź spadającą kroplę bezpiecznie na ziemię, omijając przeszkody po drodze. Zagraj w grę, aby sprawdzić swój refleks!",
    station4Title: "Stacja IV: Hex Connect",
    station4Text: "Połącz sześciokątne rury, aby poprowadzić wodę od źródła do celu. Logiczna łamigłówka przepływu!",
    station5Title: "Stacja V: Wpływ na ekosystem",
    station5Text: "Ekosystem rzeki to delikatna równowaga. Nawet zabawa może mieć na niego wpływ. Puść swoją kaczkę z prądem rzeki, aby zobaczyć, jak obiekty i przepływ na siebie oddziałują! Zagraj w grę, aby dowiedzieć się więcej.",
    slider1Label: "Jak daleko od miasta znajduje się źródło wody?",
    simulationTitle: "Wyniki symulacji",
    nextStationButton: (station) => `Następna stacja ${station}`,
    viewSummaryButton: "Zobacz podsumowanie",
    pointsScored: "Zdobyte punkty:",
    summaryFeedback: (nickname) => `Gratulacje, ${nickname}! Twoje decyzje pokazują, że świetnie rozumiesz dynamikę rzeki.`,
    ariaGoToApp: "Przejdź do aplikacji FlowApp",
    ariaEnterNickname: "Wprowadź swój nick",
    ariaReturnToStart: "Wróć do ekranu startowego",
    ariaStationSelection: "Wybór stacji",
    ariaStation: (num) => `Stacja ${num}`,
    playGameButton: (gameName) => `Zagraj w ${gameName}`,
    yourScore: "Twój wynik:",
    closeGame: "Zamknij grę",
    fullscreen: "Pełny ekran",
    enterFullscreen: "Włącz pełny ekran",
    exitFullscreen: "Wyłącz pełny ekran",
  },
  de: {
    splashSubtitle: "Das einzigartige Erlebnis des Mandau-Flusses",
    goButton: "Mit dem Strom schwimmen",
    loginTitle: "Wähle deinen Nickname",
    loginPlaceholder: "Dein Nickname...",
    loginButton: "Spiel starten",
    station1Title: "Station I: Brücke über die Mandau",
    station1Text: "Sie stehen auf der Brücke über die Mandau. Dieser Fluss schlängelt sich durch drei Länder und birgt viele Geschichten. Leider birgt er auch etwas Müll. Ihre erste Aufgabe ist es, bei der Reinigung dieses Flussabschnitts zu helfen. Spielen Sie das Spiel, um etwas zu bewirken!",
    station2Title: "Station II: Wasserflusssimulation",
    station2Text: "Wasser ist eine dynamische Kraft. Unten sehen Sie zwei Simulationen des Wasserflusses. Die erste zeigt eine 2D-Darstellung, die zum Verständnis der Oberflächenbewegung hilfreich ist. Die zweite ist eine 3D-Simulation, die ein besseres Gefühl für Volumen und Tiefe vermittelt. Beobachten Sie, wie Wasser in beiden Modellen mit seiner Umgebung interagiert.",
    station3Title: "Station III: Fallender Tropfen",
    station3Text: "Führe den fallenden Tropfen sicher zum Boden und weiche dabei den Hindernissen aus. Spiele das Spiel, um deine Reflexe zu testen!",
    station4Title: "Station IV: Hex Connect",
    station4Text: "Verbinde die sechseckigen Rohre, um das Wasser von der Quelle zum Ziel zu leiten. Ein Logik- und Fließrätsel!",
    station5Title: "Station V: Auswirkungen auf das Ökosystem",
    station5Text: "Das Ökosystem des Flusses ist ein empfindliches Gleichgewicht. Selbst lustige Aktivitäten können Auswirkungen haben. Lass deine Ente den Fluss hinunterrasen, um zu sehen, wie Objekte und Strömung interagieren! Spiele das Spiel, um mehr zu erfahren.",
    slider1Label: "Wie weit ist die Wasserquelle von der Stadt entfernt?",
    simulationTitle: "Simulationsergebnisse",
    nextStationButton: (station) => `Nächste Station ${station}`,
    viewSummaryButton: "Zusammenfassung ansehen",
    pointsScored: "Erreichte Punkte:",
    summaryFeedback: (nickname) => `Herzlichen Glückwunsch, ${nickname}! Deine Entscheidungen zeigen ein großes Verständnis für die Flussdynamik.`,
    ariaGoToApp: "Zur FlowApp-Anwendung gehen",
    ariaEnterNickname: "Gib deinen Nickname ein",
    ariaReturnToStart: "Zurück zum Startbildschirm",
    ariaStationSelection: "Stationsauswahl",
    ariaStation: (num) => `Station ${num}`,
    playGameButton: (gameName) => `Spiele ${gameName}`,
    yourScore: "Deine Punktzahl:",
    closeGame: "Spiel schließen",
    fullscreen: "Vollbild",
    enterFullscreen: "Vollbildmodus aktivieren",
    exitFullscreen: "Vollbildmodus beenden",
  },
  cs: {
    splashSubtitle: "Jedinečný zážitek z řeky Mandavy",
    goButton: "Jít s proudem",
    loginTitle: "Zvolte si přezdívku",
    loginPlaceholder: "Vaše přezdívka...",
    loginButton: "Spustit hru",
    station1Title: "Stanice I: Most přes Mandavu",
    station1Text: "Stojíte na mostě přes Mandavu. Tato řeka se vine třemi zeměmi a skrývá mnoho příběhů. Bohužel také skrývá nějaké odpadky. Vaším prvním úkolem je pomoci vyčistit tento úsek řeky. Zahrajte si hru, abyste něco změnili!",
    station2Title: "Stanice II: Simulace proudění vody",
    station2Text: "Voda je dynamická síla. Níže vidíte dvě simulace proudění vody. První ukazuje 2D znázornění, které pomáhá pochopit pohyb na povrchu. Druhá je 3D simulace, která dává lepší představu o objemu a hloubce. Pozorujte, jak voda v obou modelech interaguje se svým prostředím.",
    station3Title: "Stanice III: Padající kapka",
    station3Text: "Proveďte padající kapku bezpečně na zem a vyhýbejte se překážkám na cestě. Zahrajte si hru a otestujte své reflexy!",
    station4Title: "Stanice IV: Hex Connect",
    station4Text: "Spojte šestiúhelníkové trubky a veďte vodu od zdroje k cíli. Logická hádanka o proudění!",
    station5Title: "Stanice V: Vliv na ekosystém",
    station5Text: "Ekosystém řeky je křehká rovnováha. I zábavné aktivity mohou mít dopad. Pusťte svou kachnu po řece, abyste viděli, jak objekty a proudění interagují! Zahrajte si hru a dozvíte se více.",
    slider1Label: "Jak daleko je zdroj vody od města?",
    simulationTitle: "Výsledky simulace",
    nextStationButton: (station) => `Další stanice ${station}`,
    viewSummaryButton: "Zobrazit souhrn",
    pointsScored: "Získané body:",
    summaryFeedback: (nickname) => `Gratulujeme, ${nickname}! Vaše rozhodnutí ukazují skvělé porozumění dynamice řeky.`,
    ariaGoToApp: "Přejít do aplikace FlowApp",
    ariaEnterNickname: "Zadejte svou přezdívku",
    ariaReturnToStart: "Vrátit se na úvodní obrazovku",
    ariaStationSelection: "Výběr stanice",
    ariaStation: (num) => `Stanice ${num}`,
    playGameButton: (gameName) => `Hrát ${gameName}`,
    yourScore: "Tvé skóre:",
    closeGame: "Zavřít hru",
    fullscreen: "Celá obrazovka",
    enterFullscreen: "Vstoupit do režimu celé obrazovky",
    exitFullscreen: "Ukončit režim celé obrazovky",
  },
};

const GAMES = {
  1: { url: './public/river-guardian-game/index.html', name: 'River Guardian' },
  2: { url: './public/reynolds-experiment.html', name: 'Reynolds Experiment' },
  3: { url: './public/falling-drop/index.html', name: 'Falling Drop' },
  4: { url: './public/hex-connect/index.html', name: 'Hex Connect' },
  5: { url: './public/duck-race-game/index.html', name: 'Duck Race Game' }
};

const SkyBlue = '#00A9E0';
const LightBackgroundMockup = '#FFFFFF';
const DarkTextMockup = '#3A4B5F';
const SubtleBorderMockup = 'rgba(200, 210, 220, 0.5)';
const InactiveStationBg = '#E9EEF2';

const LANGUAGES = {
    en: { name: 'English', flag: '🇬🇧' },
    pl: { name: 'Polski', flag: '🇵🇱' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    cs: { name: 'Čeština', flag: '🇨🇿' }
};

// --- Reusable UI Components ---

const LanguageSwitcher = ({ lang, setLang, theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const switcherRef = useRef(null);
    const isSplashOrLogin = theme === 'splash' || theme === 'login';

    const styles = {
        container: { position: 'relative', zIndex: 100 },
        button: { background: isSplashOrLogin ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)', border: isSplashOrLogin ? '1px solid rgba(255, 255, 255, 0.5)' : `1px solid ${SubtleBorderMockup}`, color: isSplashOrLogin ? LightBackgroundMockup : DarkTextMockup, padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '14px', backdropFilter: isSplashOrLogin ? 'blur(5px)' : 'none', },
        dropdown: { position: 'absolute', top: 'calc(100% + 5px)', right: 0, background: LightBackgroundMockup, borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', overflow: 'hidden', display: isOpen ? 'block' : 'none', minWidth: '100px', },
        option: { padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '15px', color: DarkTextMockup, }
    };
    
    const splashContainerStyle = { position: 'absolute', top: '20px', right: '20px', zIndex: 100 };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectLang = (langCode) => {
        setLang(langCode);
        setIsOpen(false);
    };

    return React.createElement('div', { style: isSplashOrLogin ? splashContainerStyle : styles.container, ref: switcherRef },
        React.createElement('button', { style: styles.button, onClick: () => setIsOpen(!isOpen) }, lang.toUpperCase()),
        React.createElement('div', { style: styles.dropdown },
            Object.keys(LANGUAGES).map(code => (
                React.createElement('div', {
                    key: code,
                    style: { ...styles.option, backgroundColor: lang === code ? InactiveStationBg : 'transparent' },
                    onClick: () => handleSelectLang(code)
                }, code.toUpperCase())
            ))
        )
    );
};

const DropletLogoSVG = ({ size = "80px", theme = "default" }) => {
    const isSplash = theme === 'splash';
    const isLogin = theme === 'login';
    const getFill = () => (isSplash || isLogin) ? LightBackgroundMockup : "url(#dropletGradientSkyBlue)";
    const getStroke = () => (isSplash || isLogin) ? SkyBlue : LightBackgroundMockup;

    return React.createElement('svg', { width: size, height: size, viewBox: "0 0 100 125", xmlns: "http://www.w3.org/2000/svg", style: { display: 'block', margin: '0 auto' } },
        React.createElement('defs', null,
            React.createElement('linearGradient', { id: "dropletGradientSkyBlue", x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
                React.createElement('stop', { offset: "0%", style: { stopColor: '#30C9FF', stopOpacity: 1 } }),
                React.createElement('stop', { offset: "100%", style: { stopColor: SkyBlue, stopOpacity: 1 } })
            )
        ),
        React.createElement('path', { d: "M50 0 C10 31.25, 10 81.25, 50 122.5 C90 81.25, 90 31.25, 50 0 Z", fill: getFill() }),
        React.createElement('path', { d: "M25 85 C30 72.5, 40 68.75, 48 77.5 S60 90, 75 81.25", stroke: getStroke(), strokeWidth: "5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }),
        React.createElement('path', { d: "M38 43.75 Q42 41.25, 45 43.75 Q40 53.75, 35 50 Q36 46.25, 38 43.75 Z", fill: isSplash ? "rgba(0, 169, 224, 0.5)" : "rgba(255,255,255,0.7)" })
    );
};

const FlowAppText = ({ size = "32px", isHeader = false, theme = 'default' }) => {
    const isSplashOrLogin = theme === 'splash' || theme === 'login';
    const getTextColor = (base) => isSplashOrLogin ? LightBackgroundMockup : (base === 'dark' ? DarkTextMockup : SkyBlue);

    return React.createElement('div', {
        style: { fontSize: size, fontWeight: '700', textAlign: 'center', letterSpacing: isHeader ? '0.2px' : '0.5px', marginTop: isHeader ? '0' : '5px', marginLeft: isHeader ? '10px' : '0', lineHeight: '1.2' }
    },
        React.createElement('span', { style: { color: getTextColor('dark') } }, "Flow"),
        React.createElement('span', { style: { color: getTextColor('blue') } }, "App")
    );
};

const FlowAppLogo = ({ svgSize = "80px", textSize = "32px", layout = "vertical", containerStyle = {}, theme = 'default' }) => {
  const isHeaderLayout = layout === 'horizontal';
  return React.createElement('div', {
    style: { display: 'flex', flexDirection: isHeaderLayout ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', ...containerStyle }
  },
    React.createElement(DropletLogoSVG, { size: svgSize, theme: theme }),
    React.createElement(FlowAppText, { size: textSize, isHeader: isHeaderLayout, theme: theme })
  );
};

const TrophyIconSVG = ({ size = "60px", color = DarkTextMockup }) => (
    React.createElement('svg', { width: size, height: size, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { display: 'block', margin: '0 auto 15px auto', transform: 'translateY(0)', transition: 'transform 0.5s ease-out' } },
      React.createElement('path', { d: "M12 4C12 4 12.0494 5.20164 12.2078 6.09069C12.3662 6.97974 12.6369 7.58516 13.0655 8.1697C13.8821 9.27777 15.1111 10 17 10H19C19.5523 10 20 9.55228 20 9V7C20 6.44772 19.5523 6 19 6H18M12 4C12 4 11.9506 5.20164 11.7922 6.09069C11.6338 6.97974 11.3631 7.58516 10.9345 8.1697C10.1179 9.27777 8.88889 10 7 10H5C4.44772 10 4 9.55228 4 9V7C4 6.44772 4.44772 6 5 6H6M12 4V2M12 12V10M12 12H15M12 12H9M12 12C12 14.7614 9.76142 17 7 17H6C4.89543 17 4 17.8954 4 19V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V19C20 17.8954 19.1046 17 18 17H17C14.2386 17 12 14.7614 12 12Z", stroke: color, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
    )
);

const WaterBackground = ({ wave1Transform = '', wave2Transform = '' }) => {
    const styles = {
        svg: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'visible' },
        waveContainer: {
            position: 'absolute',
            top: '45%',
            left: '-25%',
            width: '150%',
            height: '100%',
            transition: 'transform 0.1s linear',
            willChange: 'transform'
        },
        wave: { fill: 'rgba(48, 201, 255, 0.7)', animation: 'waveAnimation 8s ease-in-out infinite alternate' },
        wave2: { fill: 'rgba(0, 169, 224, 0.5)', animation: 'waveAnimation2 10s ease-in-out infinite alternate' }
    };
    const wavePath = "M-10,50 C150,150 350,-50 510,50 L510,250 L-10,250 Z";
    const wavePath2 = "M-10,60 C200,100 300,0 510,60 L510,250 L-10,250 Z";

    return React.createElement(React.Fragment, null,
        React.createElement('div', { style: { ...styles.waveContainer, transform: wave2Transform } },
            React.createElement('svg', { style: styles.svg, viewBox: "0 0 500 250", preserveAspectRatio: "none" },
                React.createElement('path', { d: wavePath2, style: styles.wave2 })
            )
        ),
        React.createElement('div', { style: { ...styles.waveContainer, transform: wave1Transform } },
            React.createElement('svg', { style: styles.svg, viewBox: "0 0 500 250", preserveAspectRatio: "none" },
                React.createElement('path', { d: wavePath, style: styles.wave })
            )
        )
    );
};

const LazyGifImage = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const skeletonStyle = { width: '100%', height: '180px', borderRadius: '15px', backgroundColor: '#f0f4f7', background: 'linear-gradient(90deg, #e9eef2 25%, #f0f4f7 50%, #e9eef2 75%)', backgroundSize: '200% 100%', animation: 'skeleton-loading 1.5s infinite linear', display: isLoaded ? 'none' : 'block' };
    const imageStyle = { opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in-out' };
    return React.createElement(React.Fragment, null,
        React.createElement('div', { style: skeletonStyle }),
        React.createElement('img', { src: src, alt: alt, className: className, style: imageStyle, onLoad: () => setIsLoaded(true) })
    );
};

const AnimatedCounter = ({ end, duration = 1500 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration]);
    return React.createElement('span', null, count);
};

const FullscreenEnterIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5" })
  )
);

const FullscreenExitIcon = (props) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", d: "M10 4H4v6M14 4h6v6M14 20h6v-6M10 20H4v-6" })
  )
);

const FullscreenButton = ({ onClick, isFullscreen, t }) => {
    return React.createElement('button', {
        className: 'fullscreen-button',
        onClick: onClick,
        'aria-label': isFullscreen ? t('exitFullscreen') : t('enterFullscreen'),
        title: isFullscreen ? t('exitFullscreen') : t('enterFullscreen')
    }, isFullscreen ? React.createElement(FullscreenExitIcon) : React.createElement(FullscreenEnterIcon));
};


const GameModal = ({ url, onClose, t }) => {
    if (!url) return null;
    const iframeRef = useRef(null);

    const handleFullscreen = () => {
        const iframe = iframeRef.current;
        if (iframe) {
            if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            } else if (iframe.webkitRequestFullscreen) { /* Safari */
                iframe.webkitRequestFullscreen();
            } else if (iframe.msRequestFullscreen) { /* IE11 */
                iframe.msRequestFullscreen();
            }
        }
    };
    
    const styles = {
        overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' },
        modal: { position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
        controls: { position: 'absolute', top: '15px', right: '15px', zIndex: 1001, display: 'flex', gap: '10px' },
        controlButton: { width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '24px', lineHeight: '40px', textAlign: 'center', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center'},
        iframe: { flexGrow: 1, border: 'none' },
    };

    return React.createElement('div', { style: styles.overlay, role: 'dialog', 'aria-modal': 'true' },
        React.createElement('div', { style: styles.modal },
            React.createElement('div', { style: styles.controls },
              React.createElement('button', { style: styles.controlButton, onClick: handleFullscreen, 'aria-label': t('fullscreen'), title: t('fullscreen') }, 
                React.createElement(FullscreenEnterIcon, { style: { width: '22px', height: '22px' }})
              ),
              React.createElement('button', { style: styles.controlButton, onClick: onClose, 'aria-label': t('closeGame'), title: t('closeGame') }, '×')
            ),
            React.createElement('iframe', { ref: iframeRef, src: url, style: styles.iframe, title: 'Game Content', allow: 'fullscreen' })
        )
    );
};

// --- View Components ---

const SplashScreen = ({ onStart, lang, setLang, t }) => {
    const [splashVisible, setSplashVisible] = useState(false);
    const [parallax, setParallax] = useState({
        container: '',
        wave1: '',
        wave2: ''
    });
    const motionListenerRef = useRef(null);

    const handleOrientation = useCallback((event) => {
        const { beta, gamma } = event;
        if (beta === null || gamma === null) return;

        const transSensFg = 1.2;
        const transSensBg = 0.6;
        const rotSens = 0.2;

        const clampedBeta = Math.max(-90, Math.min(90, beta));
        const clampedGamma = Math.max(-90, Math.min(90, gamma));
        
        const neutralBetaOffset = 25;

        const rotateX = (clampedBeta - neutralBetaOffset) * rotSens;
        const rotateY = clampedGamma * -rotSens;
        
        const translateX_fg = clampedGamma * -transSensFg;
        const translateY_fg = (clampedBeta - neutralBetaOffset) * transSensFg;

        const translateX_bg = clampedGamma * -transSensBg;
        const translateY_bg = (clampedBeta - neutralBetaOffset) * transSensBg;

        setParallax({
            container: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            wave1: `translateX(${translateX_fg}px) translateY(${translateY_fg}px)`,
            wave2: `translateX(${translateX_bg}px) translateY(${translateY_bg}px)`
        });
    }, []);

    const addOrientationListener = useCallback(() => {
        if (motionListenerRef.current) {
            window.removeEventListener('deviceorientation', motionListenerRef.current);
        }
        motionListenerRef.current = handleOrientation;
        window.addEventListener('deviceorientation', motionListenerRef.current);
    }, [handleOrientation]);

    const handleGoClick = useCallback(async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceOrientationEvent.requestPermission();
                if (permissionState === 'granted') {
                    addOrientationListener();
                }
            } catch (error) {
                console.error("Device orientation permission request failed.", error);
            }
        }
        onStart();
    }, [onStart, addOrientationListener]);
    
    useEffect(() => {
        const timer = setTimeout(() => setSplashVisible(true), 10);

        if (typeof DeviceOrientationEvent === 'undefined' || typeof DeviceOrientationEvent.requestPermission !== 'function') {
            addOrientationListener();
        }

        return () => {
            clearTimeout(timer);
            if (motionListenerRef.current) {
                window.removeEventListener('deviceorientation', motionListenerRef.current);
            }
        };
    }, [addOrientationListener]);

    return React.createElement('div', { className: 'splash-screen' },
        React.createElement(LanguageSwitcher, { lang: lang, setLang: setLang, theme: 'splash' }),
        React.createElement('div', { className: 'splash-background' }),
        React.createElement('div', {
            className: 'parallax-container',
            style: { transform: parallax.container, transformStyle: 'preserve-3d', transition: 'transform 0.1s linear', willChange: 'transform' }
        },
            React.createElement(WaterBackground, { wave1Transform: parallax.wave1, wave2Transform: parallax.wave2 })
        ),
        React.createElement('div', { className: 'splash-content' },
            React.createElement('div', { className: `splash-intro fade-enter ${splashVisible ? 'fade-enter-active' : ''}` },
                React.createElement('div', { style: { animation: 'floatAnimation 5s ease-in-out infinite' } }, React.createElement(DropletLogoSVG, { size: "100px", theme: "splash" })),
                React.createElement(FlowAppText, { size: "40px", isHeader: false, theme: "splash" }),
                React.createElement('p', { className: 'splash-subtitle' }, t('splashSubtitle'))
            ),
            React.createElement('button', { className: 'go-button', onClick: handleGoClick, 'aria-label': t('ariaGoToApp') }, t('goButton'))
        )
    );
};

const LoginScreen = ({ onLogin, lang, setLang, t }) => {
    const [nickname, setNickname] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(nickname);
    };

    return React.createElement('div', { className: 'splash-screen' },
        React.createElement(LanguageSwitcher, { lang: lang, setLang: setLang, theme: 'login' }),
        React.createElement('div', { className: 'splash-background' }),
        React.createElement('div', { className: 'login-background-overlay' }),
        React.createElement('div', { className: 'parallax-container' }, React.createElement(WaterBackground, {})),
        React.createElement('div', { className: 'login-container' },
            React.createElement(FlowAppLogo, { svgSize: "60px", textSize: "28px", theme: "login", containerStyle: { marginBottom: '40px' } }),
            React.createElement('h1', { className: 'login-title' }, t('loginTitle')),
            React.createElement('form', { className: 'login-form', onSubmit: handleSubmit },
                React.createElement('input', { type: 'text', value: nickname, onChange: (e) => setNickname(e.target.value), className: 'login-input', placeholder: t('loginPlaceholder'), 'aria-label': t('ariaEnterNickname'), required: true, minLength: 3 }),
                React.createElement('button', { type: 'submit', className: 'login-button' }, t('loginButton'))
            )
        )
    );
};

const Header = ({ onLogoClick, lang, setLang, t, onFullscreenToggle, isFullscreen }) => (
    React.createElement('header', { className: 'main-header' },
        React.createElement('div', { className: 'logo-header-container', onClick: onLogoClick, role: 'button', 'aria-label': t('ariaReturnToStart'), title: t('ariaReturnToStart') },
            React.createElement(FlowAppLogo, { svgSize: "32px", textSize: "20px", layout: "horizontal" })
        ),
        React.createElement('div', { className: 'header-controls-container' },
            React.createElement(FullscreenButton, { onClick: onFullscreenToggle, isFullscreen: isFullscreen, t: t }),
            React.createElement(LanguageSwitcher, { lang: lang, setLang: setLang, theme: 'default' })
        )
    )
);

const StationSelector = ({ currentStation, onSelect, stationButtonRefs, pillStyle, t }) => (
    React.createElement('nav', { className: 'station-selector-container', 'aria-label': t('ariaStationSelection') },
        React.createElement('div', { className: 'station-pill', style: pillStyle }),
        [1, 2, 3, 4, 5].map(num =>
            React.createElement('button', {
                key: num,
                ref: el => stationButtonRefs.current[num - 1] = el,
                className: `station-button ${currentStation === num ? 'active' : ''}`,
                onClick: () => onSelect(num),
                'aria-pressed': currentStation === num,
                'aria-label': t('ariaStation', num)
            }, num.toString())
        )
    )
);

const MainView = ({ currentStation, onNextStation, scores, t, onPlayGame }) => {
    const stationData = {
        title: t(`station${currentStation}Title`),
        text: t(`station${currentStation}Text`)
    };
    const gameInfo = GAMES[currentStation];

    return React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'content-area' },
            React.createElement('h2', { className: 'content-title', id: `station-title-${currentStation}` }, stationData.title),
            React.createElement('p', { className: 'content-text', 'aria-labelledby': `station-title-${currentStation}` }, stationData.text),
            gameInfo && React.createElement('div', { className: 'game-section' },
                React.createElement('button', { className: 'game-button', onClick: () => onPlayGame(gameInfo.url, currentStation) }, t('playGameButton', gameInfo.name)),
                scores[currentStation] !== undefined && React.createElement('p', { className: 'score-text' }, `${t('yourScore')} ${scores[currentStation]}`)
            )
        ),
        currentStation !== 2 && React.createElement('section', { className: 'simulation-results-container', 'aria-labelledby': 'simulation-results-heading' },
            React.createElement('h3', { className: 'simulation-title', id: 'simulation-results-heading' }, t('simulationTitle')),
            (() => {
                return React.createElement('div', { className: 'gif-image', style: { backgroundColor: '#f0f4f7' }, role: 'img', 'aria-label': 'Brak symulacji dla tej stacji' });
            })()
        ),
        React.createElement('button', { className: 'navigation-button', onClick: onNextStation }, currentStation < 5 ? t('nextStationButton', currentStation + 1) : t('viewSummaryButton'))
    );
};

const SummaryView = ({ userNickname, scores, t }) => {
    const dummyGraphData = [0.8, 0.5, 0.9, 0.6, 1.0];
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    return React.createElement('div', { className: 'summary-content' },
        React.createElement(TrophyIconSVG, { color: SkyBlue }),
        React.createElement('p', { className: 'points-scored-text' }, t('pointsScored')),
        React.createElement('div', { className: 'points-value' }, React.createElement(AnimatedCounter, { end: 120 + totalScore })),
        React.createElement('div', { className: 'graph-container' },
            dummyGraphData.map((value, index) =>
                React.createElement('div', {
                    key: index,
                    className: 'graph-bar bar-grow-animation',
                    style: { height: `${value * 100}%`, animationDelay: `${index * 100}ms` }
                })
            )
        ),
        React.createElement('div', { className: 'feedback-box' },
            React.createElement('p', { className: 'feedback-text' }, t('summaryFeedback', userNickname))
        )
    );
};


// --- Main App Component ---

const App = () => {
  const [currentView, setCurrentView] = useState('splash'); // splash, login, main, summary
  const [currentStation, setCurrentStation] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [userNickname, setUserNickname] = useState(null);
  const [lang, setLang] = useState(localStorage.getItem('flowapp_lang') || 'en');
  const [scores, setScores] = useState({});
  const [gameModal, setGameModal] = useState({ isOpen: false, url: null });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stationButtonRefs = useRef([]);
  const [pillStyle, setPillStyle] = useState({});

  const t = (key, ...args) => {
    const value = translations[lang][key] || translations['en'][key];
    return typeof value === 'function' ? value(...args) : value || key;
  };

  useEffect(() => { localStorage.setItem('flowapp_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('flowapp_scores', JSON.stringify(scores)); }, [scores]);

  useEffect(() => {
    const storedNickname = localStorage.getItem('userNickname');
    if (storedNickname) setUserNickname(storedNickname);
    const storedScores = localStorage.getItem('flowapp_scores');
    if (storedScores) setScores(JSON.parse(storedScores));
  }, []);
  
  useEffect(() => {
    const handleGameMessage = (event) => {
      if (event.data && event.data.type === 'gameScore') {
        const { station, score } = event.data;
        if (station && typeof score === 'number') {
          setScores(prev => ({ ...prev, [station]: Math.max(prev[station] || 0, score) }));
          setGameModal({ isOpen: false, url: null });
        }
      }
    };
    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('msfullscreenchange', onFullscreenChange);
    return () => {
        document.removeEventListener('fullscreenchange', onFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
        document.removeEventListener('mozfullscreenchange', onFullscreenChange);
        document.removeEventListener('msfullscreenchange', onFullscreenChange);
    };
  }, []);

  useLayoutEffect(() => {
    const activeButton = stationButtonRefs.current[currentStation - 1];
    if (activeButton) {
        setPillStyle({ left: `${activeButton.offsetLeft}px`, width: `${activeButton.offsetWidth}px` });
    }
  }, [currentStation, currentView]);

  const changeContent = (action) => {
      setIsFading(true);
      setTimeout(() => {
          action();
          setIsFading(false);
      }, 250);
  };

  const handleStart = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    setCurrentView(userNickname ? 'main' : 'login');
  };

  const handleLogin = (submittedNickname) => {
    const trimmedNickname = submittedNickname.trim();
    if (trimmedNickname) {
      localStorage.setItem('userNickname', trimmedNickname);
      setUserNickname(trimmedNickname);
      setCurrentView('main');
    }
  };

  const selectStation = (stationNumber) => {
    if (stationNumber === currentStation && currentView === 'main') return;
    changeContent(() => {
        setCurrentStation(stationNumber);
        if (currentView !== 'main') setCurrentView('main');
    });
  };

  const nextStation = () => {
    changeContent(() => {
        if (currentStation < 5) {
            setCurrentStation(prev => prev + 1);
        } else {
            setCurrentView('summary');
        }
    });
  };

  const navigateToSplash = () => {
    setCurrentStation(1);
    setCurrentView('splash');
  };
  
  const handlePlayGame = (url, station) => {
    setGameModal({ isOpen: true, url: `${url}?station=${station}` });
  };
  
  const handleFullscreenToggle = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
  };

  if (currentView === 'splash') {
    return React.createElement(SplashScreen, { onStart: handleStart, lang, setLang, t });
  }
  
  if (currentView === 'login') {
    return React.createElement(LoginScreen, { onLogin: handleLogin, lang, setLang, t });
  }

  return React.createElement('div', { className: 'app-container', role: 'application' },
    gameModal.isOpen && React.createElement(GameModal, { url: gameModal.url, onClose: () => setGameModal({ isOpen: false, url: null }), t }),
    
    React.createElement(Header, { onLogoClick: navigateToSplash, lang, setLang, t, onFullscreenToggle: handleFullscreenToggle, isFullscreen: isFullscreen }),
    
    React.createElement(StationSelector, { 
        currentStation: currentView === 'summary' ? -1 : currentStation, // Deselect on summary
        onSelect: selectStation, 
        stationButtonRefs, 
        pillStyle, 
        t 
    }),
    
    React.createElement('div', { className: `scrollable-content ${isFading ? 'is-fading' : ''}` },
        currentView === 'main' && React.createElement(MainView, { 
            currentStation, 
            onNextStation: nextStation, 
            scores, 
            t, 
            onPlayGame: handlePlayGame 
        }),
        currentView === 'summary' && React.createElement(SummaryView, { userNickname, scores, t })
    )
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(StrictMode, null, React.createElement(App)));
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => console.log('SW registered.', reg)).catch(err => console.log('SW registration failed: ', err));
  });
}
