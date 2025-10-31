// Imports
import React, { useState, useEffect, StrictMode, useRef, useLayoutEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

const API_BASE_URL = 'https://flowapp-api.maciej-tadej.workers.dev';

const translations = {
  en: {
    splashSubtitle: "The unique experience of the Mandau River",
    goButton: "Go with the Flow",
    loginTitle: "Choose your nickname",
    loginPlaceholder: "Your nickname...",
    loginButton: "Start Game",
    station1Title: "Station I: Falling Drop",
    station1Text: "Every journey of water starts with a single drop of rain…\nHigh in the clouds, tiny drops come together until they grow heavy and fall toward the earth.\nBut not every drop has an easy path. Some are caught by birds, leaves, or clouds before they ever touch the Earth.\nYour mission begins up here — guide the drop safely to the ground, and discover how small changes in the sky can lead to big changes below.",
    station2Title: "Station II: Water Flow Simulation",
    station2Text: "And when just enough drops fall down, they form a river, or a lake, or a pond, maybe even the ocean. But what’s the difference between all of them?\nHere’s a hint: one of them likes to move… a lot. Yep, you guessed it — the river! Unlike lakes or ponds, rivers are constantly flowing. And guess what? This flow has a superpower… it’s called velocity!\nBasically, velocity is just a fancy word for the speed at which the water is flowing, but let’s see how it works.",
    station3Title: "Station III: River Vortex",
    station3Text: "Since the water in the rivers is constantly flowing, we humans found the way to use its power to run our homes, factories and even whole cities.This energy is called hydropower. When water flows or falls, it can spin big turbines that make electricity — just like a waterwheel, but much stronger!\nThe faster the water moves, the more energy it can create. Now imagine your ship runs on hydropower too. Use the river’s energy wisely and see if you can outsmart your opponent!",
    station4Title: "Station IV: Hex Connect",
    station4Text: "Another magic of rivers is called meandering — it happens when flowing water meets rocks, roots, or different kinds of soil.\nThese gentle twists and turns make rivers change their direction, speed, and shape as they travel through the landscape.\n\nNow it’s your turn! Can you guide the water from its source to the end of the river system?\nRemember — the fastest path isn’t always the safest one. Some routes may cause floods, while others might lead to dead ends.\n\nEach hexagon represents a river segment with its own flow speed and direction. Click to rotate them and find the best route — a river that flows smoothly and steadily all the way through!",
    station5Title: "Station V: Ecosystem Impact",
    station5Text: "As a river meanders, slower sections can form small ponds or calm areas that become important habitats for aquatic life. Fish, ducks, insects, and plants all depend on these waters to survive and thrive.\n\nNow it’s your turn to help the river’s little travelers! Guide the ducks along their path, avoid obstacles, and see how a healthy river keeps everyone happy and safe.",
    station6Title: "Station VI: Bridge over the Mandau",
    station6Text: "You’ve seen how rivers twist, flow, and create homes for life of all kinds. But rivers don’t just shape the land — they also carry everything we leave behind. Sometimes, that includes things that don’t belong in nature at all.\nAnd this is where you come in. The river has given life, transport, and safety — now it needs a guardian. Will you take up the role of Guardian of the River and protect it from pollution?",
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
    comingSoon: "Coming Soon...",
  },
  pl: {
    splashSubtitle: "Wyjątkowe doświadczenie rzeki Mandau",
    goButton: "Płyń z prądem",
    loginTitle: "Wybierz swój nick",
    loginPlaceholder: "Twój nick...",
    loginButton: "Rozpocznij grę",
    station1Title: "Stacja I: Spadająca Kropla",
    station1Text: "Każda podróż wody zaczyna się od jednej kropli deszczu…\nWysoko w chmurach małe kropelki łączą się, aż stają się ciężkie i spadają na ziemię.\nAle nie każda kropla ma łatwą drogę. Niektóre są łapane przez ptaki, liście lub chmury, zanim dotkną Ziemi.\nTwoja misja zaczyna się tutaj — poprowadź kroplę bezpiecznie na ziemię i odkryj, jak małe zmiany na niebie mogą prowadzić do wielkich zmian na dole.",
    station2Title: "Stacja II: Symulacja przepływu wody",
    station2Text: "A kiedy spadnie wystarczająco dużo kropel, tworzą rzekę, jezioro, staw, a może nawet ocean. Ale jaka jest między nimi różnica?\nOto podpowiedź: jedno z nich bardzo lubi się ruszać… Tak, zgadłeś — rzeka! W przeciwieństwie do jezior czy stawów, rzeki nieustannie płyną. I wiesz co? Ten przepływ ma supermoc… nazywa się prędkością!\nZasadniczo, prędkość to tylko wymyślne słowo na szybkość, z jaką płynie woda, ale zobaczmy, jak to działa.",
    station3Title: "Stacja III: Wir Rzeczny",
    station3Text: "Ponieważ woda w rzekach nieustannie płynie, my, ludzie, znaleźliśmy sposób, aby wykorzystać jej moc do zasilania naszych domów, fabryk, a nawet całych miast. Ta energia nazywa się hydroenergią. Kiedy woda płynie lub spada, może obracać wielkie turbiny, które wytwarzają prąd — zupełnie jak koło wodne, ale o wiele potężniejsze!\nIm szybciej porusza się woda, tym więcej energii może wytworzyć. A teraz wyobraź sobie, że twój statek również działa na hydroenergię. Używaj energii rzeki mądrze i sprawdź, czy potrafisz przechytrzyć przeciwnika!",
    station4Title: "Stacja IV: Hex Connect",
    station4Text: "Inną magią rzek jest meandrowanie — dzieje się tak, gdy płynąca woda napotyka skały, korzenie lub różne rodzaje gleby.\nTe łagodne zakręty sprawiają, że rzeki zmieniają swój kierunek, prędkość i kształt podczas podróży przez krajobraz.\n\nTeraz twoja kolej! Czy potrafisz poprowadzić wodę od źródła do końca systemu rzecznego?\nPamiętaj — najszybsza droga nie zawsze jest najbezpieczniejsza. Niektóre trasy mogą powodować powodzie, a inne mogą prowadzić do ślepych zaułków.\n\nKażdy sześciokąt reprezentuje odcinek rzeki z własną prędkością i kierunkiem przepływu. Klikaj, aby je obracać i znaleźć najlepszą trasę — rzekę, która płynie gładko i stabilnie na całej długości!",
    station5Title: "Stacja V: Wpływ na ekosystem",
    station5Text: "Gdy rzeka meandruje, w wolniejszych odcinkach mogą tworzyć się małe stawy lub spokojne obszary, które stają się ważnymi siedliskami dla życia wodnego. Ryby, kaczki, owady i rośliny zależą od tych wód, aby przetrwać i rozwijać się.\n\nTeraz Twoja kolej, aby pomóc małym podróżnikom rzeki! Poprowadź kaczki wzdłuż ich ścieżki, omijaj przeszkody i zobacz, jak zdrowa rzeka sprawia, że wszyscy są szczęśliwi i bezpieczni.",
    station6Title: "Stacja VI: Most na Mandau",
    station6Text: "Widziałeś, jak rzeki wiją się, płyną i tworzą domy dla wszelkiego rodzaju życia. Ale rzeki nie tylko kształtują ląd — niosą ze sobą również wszystko, co po sobie zostawiamy. Czasami są to rzeczy, które w ogóle nie należą do natury.\nI tu wkraczasz ty. Rzeka dała życie, transport i bezpieczeństwo — teraz potrzebuje strażnika. Czy podejmiesz się roli Strażnika Rzeki i ochronisz ją przed zanieczyszczeniem?",
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
    comingSoon: "Wkrótce...",
  },
  de: {
    splashSubtitle: "Das einzigartige Erlebnis des Mandau-Flusses",
    goButton: "Mit dem Strom schwimmen",
    loginTitle: "Wähle deinen Nickname",
    loginPlaceholder: "Dein Nickname...",
    loginButton: "Spiel starten",
    station1Title: "Station I: Fallender Tropfen",
    station1Text: "Jede Reise des Wassers beginnt mit einem einzigen Regentropfen…\nHoch in den Wolken verbinden sich winzige Tropfen, bis sie schwer werden und zur Erde fallen.\nAber nicht jeder Tropfen hat einen leichten Weg. Einige werden von Vögeln, Blättern oder Wolken aufgefangen, bevor sie die Erde berühren.\nDeine Mission beginnt hier oben – führe den Tropfen sicher zu Boden und entdecke, wie kleine Veränderungen am Himmel zu großen Veränderungen unten führen können.",
    station2Title: "Station II: Wasserflusssimulation",
    station2Text: "Und wenn genug Tropfen herunterfallen, bilden sie einen Fluss, einen See, einen Teich oder vielleicht sogar das Meer. Aber was ist der Unterschied zwischen ihnen allen?\nHier ist ein Hinweis: einer von ihnen bewegt sich gerne… sehr. Ja, du hast es erraten – der Fluss! Im Gegensatz zu Seen oder Teichen fließen Flüsse ständig. Und rate mal? Dieser Fluss hat eine Superkraft… sie heißt Geschwindigkeit!\nIm Grunde ist Geschwindigkeit nur ein schickes Wort für die Geschwindigkeit, mit der das Wasser fließt, aber sehen wir uns an, wie es funktioniert.",
    station3Title: "Station III: Flusswirbel",
    station3Text: "Da das Wasser in den Flüssen ständig fließt, haben wir Menschen einen Weg gefunden, seine Kraft zu nutzen, um unsere Häuser, Fabriken und sogar ganze Städte zu betreiben. Diese Energie wird Wasserkraft genannt. Wenn Wasser fließt oder fällt, kann es große Turbinen antreiben, die Strom erzeugen – genau wie ein Wasserrad, nur viel stärker!\nJe schneller sich das Wasser bewegt, desto mehr Energie kann es erzeugen. Stell dir nun vor, auch dein Schiff wird mit Wasserkraft angetrieben. Nutze die Energie des Flusses weise und sieh, ob du deinen Gegner überlisten kannst!",
    station4Title: "Station IV: Hex Connect",
    station4Text: "Eine weitere Magie der Flüsse nennt sich Mäandrieren – es passiert, wenn fließendes Wasser auf Felsen, Wurzeln oder verschiedene Bodenarten trifft.\nDiese sanften Kurven und Windungen lassen Flüsse ihre Richtung, Geschwindigkeit und Form ändern, während sie durch die Landschaft reisen.\n\nJetzt bist du an der Reihe! Kannst du das Wasser von seiner Quelle bis zum Ende des Flusssystems leiten?\nDenk daran – der schnellste Weg ist nicht immer der sicherste. Einige Routen können Überschwemmungen verursachen, während andere in Sackgassen enden können.\n\nJedes Sechseck stellt einen Flussabschnitt mit eigener Fließgeschwindigkeit und -richtung dar. Klicke, um sie zu drehen und den besten Weg zu finden – einen Fluss, der auf ganzer Länge reibungslos und stetig fließt!",
    station5Title: "Station V: Auswirkungen auf das Ökosystem",
    station5Text: "Wenn ein Fluss mäandriert, können in langsameren Abschnitten kleine Teiche oder ruhige Bereiche entstehen, die zu wichtigen Lebensräumen für Wasserlebewesen werden. Fische, Enten, Insekten und Pflanzen sind alle auf diese Gewässer angewiesen, um zu überleben und zu gedeihen.\n\nJetzt bist du an der Reihe, den kleinen Reisenden des Flusses zu helfen! Führe die Enten auf ihrem Weg, weiche Hindernissen aus und sieh, wie ein gesunder Fluss alle glücklich und sicher macht.",
    station6Title: "Station VI: Brücke über die Mandau",
    station6Text: "Du hast gesehen, wie Flüsse sich winden, fließen und Lebensräume für alle Arten von Lebewesen schaffen. Aber Flüsse formen nicht nur das Land – sie tragen auch alles mit sich, was wir zurücklassen. Manchmal gehören dazu Dinge, die überhaupt nicht in die Natur gehören.\nUnd hier kommst du ins Spiel. Der Fluss hat Leben, Transport und Sicherheit gegeben – jetzt braucht er einen Wächter. Wirst du die Rolle des Wächters des Flusses übernehmen und ihn vor Verschmutzung schützen?",
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
    comingSoon: "Bald verfügbar...",
  },
  cs: {
    splashSubtitle: "Jedinečný zážitek z řeky Mandavy",
    goButton: "Jít s proudem",
    loginTitle: "Zvolte si přezdívku",
    loginPlaceholder: "Vaše přezdívka...",
    loginButton: "Spustit hru",
    station1Title: "Stanice I: Padající kapka",
    station1Text: "Každá cesta vody začíná jedinou kapkou deště…\nVysoko v oblacích se malé kapky spojují, dokud neztěžknou a nespadnou na zem.\nAle ne každá kapka má snadnou cestu. Některé jsou zachyceny ptáky, listy nebo mraky, než se vůbec dotknou Země.\nTvá mise začíná tady nahoře – veď kapku bezpečně na zem a objev, jak malé změny na obloze mohou vést k velkým změnám dole.",
    station2Title: "Stanice II: Simulace proudění vody",
    station2Text: "A když spadne dostatek kapek, vytvoří řeku, jezero, rybník nebo možná i oceán. Ale jaký je mezi nimi rozdíl?\nTady je nápověda: jedno z nich se rádo hýbe… hodně. Ano, uhodl jsi – řeka! Na rozdíl od jezer nebo rybníků řeky neustále tečou. A hádej co? Tento proud má superschopnost… říká se jí rychlost!\nV podstatě je rychlost jen nóbl slovo pro rychlost, jakou voda teče, ale podívejme se, jak to funguje.",
    station3Title: "Stanice III: Říční vír",
    station3Text: "Jelikož voda v řekách neustále proudí, my lidé jsme našli způsob, jak její sílu využít k napájení našich domovů, továren a dokonce celých měst. Tato energie se nazývá hydroenergie. Když voda proudí nebo padá, může roztáčet velké turbíny, které vyrábějí elektřinu – stejně jako vodní kolo, ale mnohem silnější!\nČím rychleji se voda pohybuje, tím více energie může vytvořit. Teď si představ, že i tvoje loď jezdí na hydroenergii. Využívej energii řeky moudře a zjisti, jestli dokážeš přechytračit svého soupeře!",
    station4Title: "Stanice IV: Hex Connect",
    station4Text: "Další kouzlo řek se nazývá meandrování — dochází k němu, když tekoucí voda narazí na skály, kořeny nebo různé druhy půdy.\nTyto jemné zákruty způsobují, že řeky mění svůj směr, rychlost a tvar, jak putují krajinou.\n\nNyní jsi na řadě ty! Dokážeš vést vodu od jejího zdroje až na konec říčního systému?\nPamatuj — nejrychlejší cesta není vždy ta nejbezpečnější. Některé trasy mohou způsobit záplavy, zatímco jiné mohou vést do slepých uliček.\n\nKaždý šestiúhelník představuje úsek řeky s vlastní rychlostí a směrem toku. Klikáním je otáčej a najdi nejlepší cestu — řeku, která teče plynule a stabilně po celé délce!",
    station5Title: "Stanice V: Vliv na ekosystém",
    station5Text: "Jak řeka meandruje, v pomalejších úsecích se mohou tvořit malá jezírka nebo klidné oblasti, které se stávají důležitými stanovišti pro vodní život. Ryby, kachny, hmyz a rostliny jsou všechny závislé na těchto vodách, aby přežily a prospívaly.\n\nNyní je řada na tobě, abys pomohl malým cestovatelům řeky! Veď kachny po jejich cestě, vyhýbej se překážkám a podívej se, jak zdravá řeka udržuje všechny šťastné a v bezpečí.",
    station6Title: "Stanice VI: Most přes Mandavu",
    station6Text: "Viděl jsi, jak se řeky kroutí, tečou a vytvářejí domovy pro život všeho druhu. Ale řeky nejen formují krajinu – nesou s sebou také vše, co zanecháme. Někdy to zahrnuje věci, které do přírody vůbec nepatří.\nA tady přicházíš na řadu ty. Řeka dala život, dopravu a bezpečí – nyní potřebuje strážce. Přijmeš roli Strážce řeky a ochráníš ji před znečištěním?",
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
    comingSoon: "Již brzy...",
  },
};

const GAMES = {
  1: { url: './falling-drop/index.html', name: 'Falling Drop' },
  2: { url: './river-flow-game/reynolds-experiment.html', name: 'Reynolds Challenge' },
  3: { url: './vortex-game/index.html', name: 'Vortex Game' },
  4: { url: './hex-connect/index.html', name: 'Hex Connect' },
  5: { url: './duck-race-game/index.html', name: 'Duck Race' },
  6: { url: './river-guardian-game/index.html', name: 'River Guardian' }
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
    const isSplashOrLogin = theme === 'splash' || theme === 'login';
    const dropletFill = isSplashOrLogin ? 'rgba(255, 255, 255, 0.9)' : SkyBlue;
    const waveStroke = isSplashOrLogin ? SkyBlue : LightBackgroundMockup;

    return React.createElement('svg', {
            width: size,
            height: size,
            viewBox: "0 0 50 80",
            xmlns: "http://www.w3.org/2000/svg",
            style: { display: 'block', margin: '0 auto' }
        },
        React.createElement('path', {
            d: "M25,80 C12.3,80 0,68 0,50 C0,25 25,0 25,0 C25,0 50,25 50,50 C50,68 37.7,80 25,80Z",
            fill: dropletFill
        }),
        React.createElement('path', {
            d: "M 0, 50 C 12.5, 25, 37.5, 75, 50, 50",
            fill: "none",
            stroke: waveStroke,
            strokeWidth: "1.75",
            style: { opacity: isSplashOrLogin ? 1 : 0.9 }
        })
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
        ),
        React.createElement('div', { className: 'sponsor-bar' },
            React.createElement('div', { className: 'sponsor-logos-container' },
                React.createElement('img', { src: '/assets/sponsor_logo_1.png', alt: 'Sponsor Logo 1', className: 'sponsor-logo' }),
                React.createElement('img', { src: '/assets/sponsor_logo_2.jpg', alt: 'Sponsor Logo 2', className: 'sponsor-logo' })
            )
        )
    );
};

const LoginScreen = ({ onLogin, lang, setLang, t }) => {
    const [nickname, setNickname] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onLogin(nickname); };
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
        [1, 2, 3, 4, 5, 6].map(num =>
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
    const stationData = { title: t(`station${currentStation}Title`), text: t(`station${currentStation}Text`) };
    const gameInfo = GAMES[currentStation];
    return React.createElement(React.Fragment, null,
        React.createElement('div', { className: 'content-area' },
            React.createElement('h2', { className: 'content-title', id: `station-title-${currentStation}` }, stationData.title),
            React.createElement('p', { className: 'content-text', 'aria-labelledby': `station-title-${currentStation}`, style: { whiteSpace: 'pre-wrap' } }, stationData.text),
            gameInfo && React.createElement('div', { className: 'game-section' },
                React.createElement('button', { className: 'game-button', onClick: () => onPlayGame(gameInfo.url, currentStation) }, t('playGameButton', gameInfo.name)),
                scores[currentStation] !== undefined && React.createElement('p', { className: 'score-text' }, `${t('yourScore')} ${scores[currentStation]}`)
            )
        ),
        React.createElement('button', { className: 'navigation-button', onClick: onNextStation }, currentStation < 6 ? t('nextStationButton', currentStation + 1) : t('viewSummaryButton'))
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
                React.createElement('div', { key: index, className: 'graph-bar bar-grow-animation', style: { height: `${value * 100}%`, animationDelay: `${index * 100}ms` } })
            )
        ),
        React.createElement('div', { className: 'feedback-box' },
            React.createElement('p', { className: 'feedback-text' }, t('summaryFeedback', userNickname))
        )
    );
};

// --- Main App Component ---
const App = () => {
  const [currentView, setCurrentView] = useState('splash');
  const [currentStation, setCurrentStation] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [userNickname, setUserNickname] = useState(null);
  const [lang, setLang] = useState(localStorage.getItem('flowapp_lang') || 'en');
  const [scores, setScores] = useState({});
  const [gameModal, setGameModal] = useState({ isOpen: false, url: null });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stationButtonRefs = useRef([]);
  const [pillStyle, setPillStyle] = useState({});
  const touchStartX = useRef(0), touchStartY = useRef(0), touchEndX = useRef(0), touchEndY = useRef(0);

  const t = (key, ...args) => { const value = translations[lang][key] || translations['en'][key]; return typeof value === 'function' ? value(...args) : value || key; };

// START: Sending player data to db

// START: Sending player data to db
  const sendGameResultToServer = async (endpoint, data) => {
    if (!userNickname) {
      console.error("Cannot send result without a user nickname.");
      return;
    }
    
    // Upewniamy się, że nazwa gracza jest w danych
    const payload = {
      ...data,
      player_name: userNickname,
    };
    
    console.log(`Sending data to ${endpoint}:`, payload);
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        console.log("Data successfully sent to the server!");
      } else {
        const errorText = await response.text();
        console.error("Failed to send data to the server:", errorText);
      }
    } catch (error) {
      console.error("Error sending data to the server:", error);
    }
  };
  // END: Sending player data to db

  useEffect(() => { localStorage.setItem('flowapp_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('flowapp_scores', JSON.stringify(scores)); }, [scores]);
  useEffect(() => { const storedNickname = localStorage.getItem('userNickname'); if (storedNickname) setUserNickname(storedNickname); const storedScores = localStorage.getItem('flowapp_scores'); if (storedScores) setScores(JSON.parse(storedScores)); }, []);
  
  useEffect(() => {
    const handleGameMessage = (event) => {
      if (!event.data || !event.data.type) return;

      // Obsługa starych gier zwracających punkty
      if (event.data.type === 'gameScore') {
        const { station, score } = event.data;
        if (station && typeof score === 'number') {
          setScores(prev => ({ ...prev, [station]: Math.max(prev[station] || 0, score) }));
          setGameModal({ isOpen: false, url: null });
        }
      } 
      // Obsługa Duck Race (stary format)
      else if (event.data.type === 'gameTime') {
        const { completion_time_ms, language } = event.data;
        if (typeof completion_time_ms === 'number') {
          const gameData = { completion_time_ms, language };
          sendGameResultToServer('/api/duck-race', gameData);
          setGameModal({ isOpen: false, url: null });
        }
      }
      // NOWOŚĆ: Obsługa nowego, uniwersalnego formatu
      else if (event.data.type === 'saveResult') {
        const { endpoint, data } = event.data.payload;
        if (endpoint && data) {
          sendGameResultToServer(endpoint, data);
          setGameModal({ isOpen: false, url: null });
        }
      }
    };
    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, [userNickname]); // Ważne: userNickname musi być w tablicy zależności
  // END: Sending player data to db

  useEffect(() => { localStorage.setItem('flowapp_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('flowapp_scores', JSON.stringify(scores)); }, [scores]);
  useEffect(() => { const storedNickname = localStorage.getItem('userNickname'); if (storedNickname) setUserNickname(storedNickname); const storedScores = localStorage.getItem('flowapp_scores'); if (storedScores) setScores(JSON.parse(storedScores)); }, []);
  
  useEffect(() => {
    const handleGameMessage = (event) => {
      if (event.data && event.data.type === 'gameScore') {
        const { station, score } = event.data;
        if (station && typeof score === 'number') { setScores(prev => ({ ...prev, [station]: Math.max(prev[station] || 0, score) })); setGameModal({ isOpen: false, url: null }); }
      } else if (event.data && event.data.type === 'gameTime') {
        const { completion_time_ms, language } = event.data;
        if (typeof completion_time_ms === 'number') { sendGameTimeToServer(completion_time_ms, language); setGameModal({ isOpen: false, url: null }); }
      }
    };
    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, [userNickname]);

  useEffect(() => {
    const onFullscreenChange = () => { setIsFullscreen(!!document.fullscreenElement); };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => { document.removeEventListener('fullscreenchange', onFullscreenChange); };
  }, []);

  useLayoutEffect(() => {
    const activeButton = stationButtonRefs.current[currentStation - 1];
    if (activeButton) { setPillStyle({ left: `${activeButton.offsetLeft}px`, width: `${activeButton.offsetWidth}px` }); }
  }, [currentStation, currentView]);

  const changeContent = (action) => { setIsFading(true); setTimeout(() => { action(); setIsFading(false); }, 250); };
  const handleStart = () => { const elem = document.documentElement; if (!document.fullscreenElement && elem.requestFullscreen) { elem.requestFullscreen().catch(err => console.error(err)); } setCurrentView(userNickname ? 'main' : 'login'); };
  const handleLogin = (submittedNickname) => { const trimmedNickname = submittedNickname.trim(); if (trimmedNickname) { localStorage.setItem('userNickname', trimmedNickname); setUserNickname(trimmedNickname); setCurrentView('main'); } };
  const selectStation = (stationNumber) => { if (stationNumber === currentStation && currentView === 'main') return; changeContent(() => { setCurrentStation(stationNumber); if (currentView !== 'main') setCurrentView('main'); }); };
  const nextStation = () => { changeContent(() => { if (currentStation < 6) { setCurrentStation(prev => prev + 1); } else { setCurrentView('summary'); } }); };
  const navigateToSplash = () => { setCurrentStation(1); setCurrentView('splash'); };
  const handlePlayGame = (url, station) => {const gameUrl = `${url}?station=${station}&nickname=${encodeURIComponent(userNickname || 'Guest')}`;setGameModal({ isOpen: true, url: gameUrl });};
  const handleFullscreenToggle = () => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(err => console.error(err)); } else { if (document.exitFullscreen) { document.exitFullscreen(); } } };
  const handleTouchStart = (e) => { touchStartX.current = e.targetTouches[0].clientX; touchStartY.current = e.targetTouches[0].clientY; touchEndX.current = e.targetTouches[0].clientX; touchEndY.current = e.targetTouches[0].clientY; };
  const handleTouchMove = (e) => { touchEndX.current = e.targetTouches[0].clientX; touchEndY.current = e.targetTouches[0].clientY; };
  const handleTouchEnd = () => { if (currentView !== 'main') return; const horizontalDiff = touchStartX.current - touchEndX.current; const verticalDiff = touchStartY.current - touchEndY.current; const swipeThreshold = 50; if (Math.abs(horizontalDiff) > swipeThreshold && Math.abs(horizontalDiff) > Math.abs(verticalDiff)) { if (horizontalDiff > 0) { if (currentStation < 6) { selectStation(currentStation + 1); } } else { if (currentStation > 1) { selectStation(currentStation - 1); } } } };

  if (currentView === 'splash') { return React.createElement(SplashScreen, { onStart: handleStart, lang, setLang, t }); }
  if (currentView === 'login') { return React.createElement(LoginScreen, { onLogin: handleLogin, lang, setLang, t }); }

  return React.createElement('div', { className: 'app-container', role: 'application' },
    gameModal.isOpen && React.createElement(GameModal, { url: gameModal.url, onClose: () => setGameModal({ isOpen: false, url: null }), t }),
    React.createElement(Header, { onLogoClick: navigateToSplash, lang, setLang, t, onFullscreenToggle: handleFullscreenToggle, isFullscreen }),
    React.createElement(StationSelector, { currentStation: currentView === 'summary' ? -1 : currentStation, onSelect: selectStation, stationButtonRefs, pillStyle, t }),
    React.createElement('div', { className: `scrollable-content ${isFading ? 'is-fading' : ''}`, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd },
        currentView === 'main' && React.createElement(MainView, { currentStation, onNextStation: nextStation, scores, t, onPlayGame: handlePlayGame }),
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
