

import React, { useState, useEffect, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

const STATION_CONTENT = {
  1: {
    title: "Station I: Brücke über die Mandau",
    text: "You are now standing on the Brücke über die Mandau, looking in the direction of Rumburk, where our story begins....Over there, the Mandau winds its way through three countries, the Czech Republic, Germany, and Poland. A peaceful stream at first glance... but don't be fooled. This river has seen things. Big things."
  },
  2: {
    title: "Station II: Water Flow Simulation",
    text: "Water is a dynamic force. Below, you can see two simulations of water flow. The first shows a 2D representation, helpful for understanding surface movement. The second is a 3D simulation, which gives a better sense of volume and depth. Observe how water interacts with its environment in both models."
  },
  3: {
    title: "Station III: Obstacle Impact",
    text: "Even small objects can significantly change the flow of water. Use the slider below to place different shapes in the water's path and observe how they alter the current in the simulation."
  },
  4: {
    title: "Station IV: Flood Events",
    text: "Placeholder content for Station IV. This station will simulate flood events and allow users to see the impact of different preventative measures."
  },
  5: {
    title: "Station V: Ecosystem Impact",
    text: "Placeholder content for Station V. Learn about the Mandau's ecosystem and how human activity and water management affect it. The simulation will show different scenarios."
  },
};

const SHAPES = [
    { name: 'Circle', url: 'https://raw.githubusercontent.com/tadejow/zittau-hackathon/main/data/flow_animation_triple_circle.gif' },
    { name: 'Rectangle', url: 'https://raw.githubusercontent.com/tadejow/zittau-hackathon/main/data/flow_animation_triple_rectangle.gif' },
    { name: 'Square', url: 'https://raw.githubusercontent.com/tadejow/zittau-hackathon/main/data/flow_animation_triple_square.gif' },
    { name: 'Triangle', url: 'https://raw.githubusercontent.com/tadejow/zittau-hackathon/main/data/flow_animation_triple_triangle.gif' }
];


// New Color Palette from Mockups
const SkyBlue = '#00A9E0'; // Primary blue from mockups
const SkyBlueDarker = '#008FC4'; // For gradients/hovers
const DarkTextMockup = '#3A4B5F'; // Dark text for "Flow" and general text
const LightBackgroundMockup = '#FFFFFF';
const InactiveStationText = '#707070';
const InactiveStationBg = '#E9EEF2'; // Softer than white
const SubtleBorderMockup = 'rgba(200, 210, 220, 0.5)'; // Subtle border

const DropletLogoSVG = ({ size = "80px", theme = "default" }) => {
    const isSplash = theme === 'splash';
    return React.createElement('svg', {
        width: size,
        height: size,
        viewBox: "0 0 100 125",
        xmlns: "http://www.w3.org/2000/svg",
        style: { display: 'block', margin: '0 auto' }
    },
        React.createElement('defs', null,
            React.createElement('linearGradient', { id: "dropletGradientSkyBlue", x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
                React.createElement('stop', { offset: "0%", style: { stopColor: '#30C9FF', stopOpacity: 1 } }),
                React.createElement('stop', { offset: "100%", style: { stopColor: SkyBlue, stopOpacity: 1 } })
            )
        ),
        React.createElement('path', {
            d: "M50 0 C10 31.25, 10 81.25, 50 122.5 C90 81.25, 90 31.25, 50 0 Z",
            fill: isSplash ? LightBackgroundMockup : "url(#dropletGradientSkyBlue)",
        }),
        React.createElement('path', {
            d: "M25 85 C30 72.5, 40 68.75, 48 77.5 S60 90, 75 81.25",
            stroke: isSplash ? SkyBlue : LightBackgroundMockup,
            strokeWidth: "5",
            fill: "none",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }),
        React.createElement('path', {
            d: "M38 43.75 Q42 41.25, 45 43.75 Q40 53.75, 35 50 Q36 46.25, 38 43.75 Z",
            fill: isSplash ? "rgba(0, 169, 224, 0.5)" : "rgba(255,255,255,0.7)"
        })
    );
};

const FlowAppText = ({ size = "32px", isHeader = false, theme = 'default' }) => {
    const isSplash = theme === 'splash';
    return React.createElement('div', {
        style: {
            fontSize: size,
            fontWeight: '700',
            textAlign: 'center',
            letterSpacing: isHeader ? '0.2px' : '0.5px',
            marginTop: isHeader ? '0' : '5px',
            marginLeft: isHeader ? '10px' : '0',
            lineHeight: '1.2',
        }
    },
        React.createElement('span', { style: { color: isSplash ? LightBackgroundMockup : DarkTextMockup } }, "Flow"),
        React.createElement('span', { style: { color: isSplash ? LightBackgroundMockup : SkyBlue } }, "App")
    );
};


const FlowAppLogo = ({
  svgSize = "80px",
  textSize = "32px",
  layout = "vertical",
  containerStyle = {},
  theme = 'default'
}) => {
  const isHeaderLayout = layout === 'horizontal';
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: isHeaderLayout ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      ...containerStyle
    }
  },
    React.createElement(DropletLogoSVG, { size: svgSize, theme: theme }),
    React.createElement(FlowAppText, { size: textSize, isHeader: isHeaderLayout, theme: theme })
  );
};

const TrophyIconSVG = ({ size = "60px", color = DarkTextMockup }) => (
    React.createElement('svg', {
        width: size, height: size, viewBox: "0 0 24 24", fill: "none", 
        xmlns: "http://www.w3.org/2000/svg",
        style: { display: 'block', margin: '0 auto 15px auto' }
    },
        React.createElement('path', {
            d: "M12 4C12 4 12.0494 5.20164 12.2078 6.09069C12.3662 6.97974 12.6369 7.58516 13.0655 8.1697C13.8821 9.27777 15.1111 10 17 10H19C19.5523 10 20 9.55228 20 9V7C20 6.44772 19.5523 6 19 6H18M12 4C12 4 11.9506 5.20164 11.7922 6.09069C11.6338 6.97974 11.3631 7.58516 10.9345 8.1697C10.1179 9.27777 8.88889 10 7 10H5C4.44772 10 4 9.55228 4 9V7C4 6.44772 4.44772 6 5 6H6M12 4V2M12 12V10M12 12H15M12 12H9M12 12C12 14.7614 9.76142 17 7 17H6C4.89543 17 4 17.8954 4 19V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V19C20 17.8954 19.1046 17 18 17H17C14.2386 17 12 14.7614 12 12Z",
            stroke: color, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round"
        })
    )
);


const App = () => {
  const [currentView, setCurrentView] = useState('splash'); // 'splash', 'main', 'summary'
  const [currentStation, setCurrentStation] = useState(1);
  const [sliderValue, setSliderValue] = useState(10); // For station 1
  const [shapeIndex, setShapeIndex] = useState(0); // For station 3

  const navigateToMainApp = () => {
    const element = document.documentElement;
    // API must be called after a user gesture (like a click)
    // to enter true fullscreen mode.
    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            console.error(`Fullscreen request failed: ${err.message} (${err.name})`);
        });
    }
    setCurrentView('main');
  };
  const navigateToSummary = () => setCurrentView('summary');
  const navigateToSplash = () => {
      setCurrentStation(1); // Reset station for a fresh start
      setCurrentView('splash');
  };
  const selectStation = (stationNumber) => {
    setCurrentStation(stationNumber);
    setCurrentView('main'); // Ensure view is 'main' when a station is selected from summary
  };
  const nextStation = () => {
    if (currentStation < 5) {
      setCurrentStation(prev => prev + 1);
    } else {
      navigateToSummary();
    }
  };

  const styles = {
    appContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '15px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    scrollableContent: {
        flexGrow: 1,
        overflowY: 'auto',
        paddingRight: '5px',
        marginRight: '-5px',
    },
    splashScreen: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      textAlign: 'center',
      height: '100%',
      padding: '40px 20px',
      boxSizing: 'border-box',
      background: SkyBlue,
    },
    splashSubtitle: {
        fontSize: '16px',
        fontWeight: '400',
        color: LightBackgroundMockup,
        marginTop: '10px',
        opacity: 0.9,
    },
    goButton: {
      padding: '15px 45px',
      fontSize: '18px',
      fontWeight: '600',
      color: SkyBlue,
      background: LightBackgroundMockup,
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    mainHeader: {
      padding: '10px 0 15px 0',
      textAlign: 'center',
      flexShrink: 0,
    },
    stationSelectorContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      margin: '0 0 15px 0',
      padding: '8px',
      borderRadius: '30px', 
      background: InactiveStationBg,
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
      flexShrink: 0,
    },
    stationButton: {
      padding: '10px 15px',
      fontSize: '15px',
      fontWeight: '600',
      color: InactiveStationText,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
    activeStationButton: {
      backgroundColor: SkyBlue,
      color: LightBackgroundMockup,
      boxShadow: `0 3px 8px rgba(0, 169, 224, 0.3)`,
    },
    contentArea: {
      padding: '20px',
      margin: '0 0 15px 0',
      borderRadius: '20px',
      background: LightBackgroundMockup,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    },
    contentTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: DarkTextMockup,
      marginBottom: '15px',
      textAlign:'center',
    },
    contentText: {
      fontSize: '15px',
      lineHeight: '1.7',
      color: DarkTextMockup,
      marginBottom: '20px',
    },
    sliderSection: {
      marginTop: '25px',
      paddingTop: '20px',
      borderTop: `1px solid ${SubtleBorderMockup}`
    },
    sliderLabel: {
      fontSize: '15px',
      fontWeight: '500',
      color: DarkTextMockup,
      marginBottom: '15px',
      textAlign: 'center',
    },
    sliderControlContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    sliderInput: {
      flexGrow: 1,
      accentColor: SkyBlue,
      cursor: 'pointer',
    },
    sliderValue: {
      fontSize: '16px',
      fontWeight: '600',
      color: SkyBlue,
      fontVariantNumeric: 'tabular-nums',
      minWidth: '50px',
      textAlign: 'right',
    },
    simulationResultsContainer: {
      paddingTop: '10px',
    },
    simulationTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: DarkTextMockup,
      marginBottom: '10px',
      textAlign:'center',
    },
    gifPlaceholder: {
      width: '100%',
      height: '180px',
      backgroundColor: 'rgba(0, 169, 224, 0.02)',
      borderRadius: '15px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: InactiveStationText,
      fontSize: '15px',
      border: `2px dashed rgba(0, 169, 224, 0.25)`,
    },
    gifImage: {
        width: '100%',
        height: '180px',
        borderRadius: '15px',
        objectFit: 'cover',
        display: 'block',
    },
    navigationButton: {
        display: 'block',
        width: 'calc(100% - 40px)',
        margin: '20px auto 10px auto',
        padding: '15px 20px',
        fontSize: '17px',
        fontWeight: '600',
        color: LightBackgroundMockup,
        background: `linear-gradient(180deg, ${SkyBlue} 0%, ${SkyBlueDarker} 100%)`,
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        boxShadow: `0 4px 12px rgba(0, 169, 224, 0.3)`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'center',
    },
    summaryContent: {
        padding: '25px',
        margin: '0 0 15px 0',
        borderRadius: '20px',
        background: LightBackgroundMockup,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        textAlign: 'center',
    },
    pointsScoredText: {
        fontSize: '22px',
        fontWeight: '700',
        color: DarkTextMockup,
        marginBottom: '10px',
    },
    graphPlaceholder: {
        width: '100%',
        height: '150px',
        backgroundColor: 'rgba(0, 169, 224, 0.05)',
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: InactiveStationText,
        fontSize: '14px',
        border: `1px solid rgba(0, 169, 224, 0.15)`,
        marginTop: '20px',
    }
  };

  const [isGoButtonHovered, setIsGoButtonHovered] = useState(false);
  const dynamicGoButtonStyle = {
    ...styles.goButton,
    transform: isGoButtonHovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isGoButtonHovered 
      ? `0 6px 18px rgba(0, 0, 0, 0.2)` 
      : styles.goButton.boxShadow,
  };
  
  const [isNavButtonHovered, setIsNavButtonHovered] = useState(false);
  const dynamicNavButtonStyle = {
    ...styles.navigationButton,
    transform: isNavButtonHovered ? 'scale(1.03)' : 'scale(1)',
    boxShadow: isNavButtonHovered 
      ? '0 6px 16px rgba(0, 169, 224, 0.35)'
      : styles.navigationButton.boxShadow,
  };


  if (currentView === 'splash') {
    return React.createElement('div', { style: styles.splashScreen },
      React.createElement('div', {},
          React.createElement(FlowAppLogo, {
            svgSize: "100px",
            textSize: "40px",
            layout: "vertical",
            theme: "splash"
          }),
          React.createElement('p', {style: styles.splashSubtitle}, "The unique experience of the Mandau River")
      ),
      React.createElement('button', {
        style: dynamicGoButtonStyle,
        onClick: navigateToMainApp,
        onMouseEnter: () => setIsGoButtonHovered(true),
        onMouseLeave: () => setIsGoButtonHovered(false),
        'aria-label': 'Przejdź do aplikacji FlowApp'
      }, "Go with the Flow")
    );
  }

  const stationData = STATION_CONTENT[currentStation];
  
  const gifUrlStation1 = sliderValue === 10
    ? 'https://raw.githubusercontent.com/tadejow/zittau-hackathon/refs/heads/main/data/burgers2d_with_levees_1.0.gif'
    : 'https://raw.githubusercontent.com/tadejow/zittau-hackathon/refs/heads/main/data/burgers2d_with_levees_1.5.gif';

  const mainContent = React.createElement(React.Fragment, null,
    React.createElement('div', { style: styles.contentArea },
      React.createElement('h2', { style: styles.contentTitle, id: `station-title-${currentStation}` }, stationData.title),
      React.createElement('p', { style: styles.contentText, 'aria-labelledby': `station-title-${currentStation}` }, stationData.text),
      currentStation === 1 && React.createElement('div', { style: styles.sliderSection },
        React.createElement('p', { id: 'slider-label-1', style: styles.sliderLabel }, 'How far is the source of the water from city?'),
        React.createElement('div', { style: styles.sliderControlContainer },
          React.createElement('input', {
            type: 'range',
            min: 10,
            max: 15,
            step: 5,
            value: sliderValue,
            onChange: (e) => setSliderValue(Number(e.target.value)),
            style: styles.sliderInput,
            'aria-labelledby': 'slider-label-1'
          }),
          React.createElement('span', { style: styles.sliderValue }, `${sliderValue}km`)
        )
      ),
      currentStation === 3 && React.createElement('div', { style: styles.sliderSection },
        React.createElement('p', { id: 'slider-label-3', style: styles.sliderLabel }, 'Select an obstacle shape'),
        React.createElement('div', { style: styles.sliderControlContainer },
          React.createElement('input', {
            type: 'range',
            min: 0,
            max: SHAPES.length - 1,
            step: 1,
            value: shapeIndex,
            onChange: (e) => setShapeIndex(Number(e.target.value)),
            style: styles.sliderInput,
            'aria-labelledby': 'slider-label-3'
          }),
          React.createElement('span', { style: { ...styles.sliderValue, minWidth: '80px' } }, SHAPES[shapeIndex].name)
        )
      )
    ),
    React.createElement('section', { style: styles.simulationResultsContainer, 'aria-labelledby': 'simulation-results-heading' },
      React.createElement('h3', { style: styles.simulationTitle, id: 'simulation-results-heading' }, "Simulation Results"),
      (() => {
        if (currentStation === 1) {
          return React.createElement('img', {
            src: gifUrlStation1,
            alt: `Symulacja powodzi dla źródła oddalonego o ${sliderValue}km`,
            style: styles.gifImage
          });
        }
        if (currentStation === 2) {
          const gif2d_url = 'https://raw.githubusercontent.com/tadejow/spello-hackathon/main/data/presentation/water_flow_2d.gif';
          const gif3d_url = 'https://raw.githubusercontent.com/tadejow/spello-hackathon/main/data/presentation/water_flow_3d.gif';
          
          return React.createElement(React.Fragment, null,
            React.createElement('img', {
              src: gif2d_url,
              alt: '2D water flow simulation',
              style: styles.gifImage 
            }),
            React.createElement('img', {
              src: gif3d_url,
              alt: '3D water flow simulation',
              style: { ...styles.gifImage, marginTop: '15px' }
            })
          );
        }
        if (currentStation === 3) {
            return React.createElement('img', {
                src: SHAPES[shapeIndex].url,
                alt: `Symulacja przepływu wody wokół kształtu: ${SHAPES[shapeIndex].name}`,
                style: styles.gifImage
            });
        }
        return React.createElement('div', { style: styles.gifPlaceholder, role: 'img', 'aria-label': 'Miejsce na wyniki symulacji (GIF)' }, "GIF will appear here");
      })()
    ),
    React.createElement('button', {
        style: dynamicNavButtonStyle,
        onClick: nextStation,
        onMouseEnter: () => setIsNavButtonHovered(true),
        onMouseLeave: () => setIsNavButtonHovered(false),
    }, currentStation < 5 ? `Next Station ${currentStation + 1}` : "View Summary")
  );

  const summaryViewContent = React.createElement(React.Fragment, null,
    React.createElement('div', {style: styles.summaryContent},
        React.createElement(TrophyIconSVG, {color: SkyBlue}),
        React.createElement('p', {style: styles.pointsScoredText}, "Points Scored: 120"),
        React.createElement('div', {style: styles.graphPlaceholder}, "Graph Placeholder")
    )
  );

  return React.createElement('div', { style: styles.appContainer, role: 'application' },
    React.createElement('header', { 
        style: { ...styles.mainHeader, cursor: 'pointer' },
        onClick: navigateToSplash,
        role: 'button',
        'aria-label': 'Return to start screen',
        title: 'Return to start screen'
     },
      React.createElement(FlowAppLogo, {
        svgSize: "32px",
        textSize: "20px",
        layout: "horizontal",
      })
    ),
    React.createElement('nav', { style: styles.stationSelectorContainer, 'aria-label': 'Wybór stacji' },
      [1, 2, 3, 4, 5].map(num =>
        React.createElement('button', {
          key: num,
          style: {
            ...styles.stationButton,
            ...(currentStation === num && currentView !== 'summary' ? styles.activeStationButton : {})
          },
          onClick: () => selectStation(num),
          'aria-pressed': currentStation === num && currentView !== 'summary',
          'aria-label': `Stacja ${num}`
        }, num.toString())
      )
    ),
    React.createElement('div', { style: styles.scrollableContent },
        currentView === 'main' ? mainContent : summaryViewContent
    )
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(StrictMode, null, React.createElement(App)));
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}