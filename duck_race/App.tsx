
import React, { useState, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import { GameState } from './types';

const MAX_LEVEL = 3;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.StartScreen);
  const [winner, setWinner] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [gameId, setGameId] = useState<number>(0);

  const handleGameEnd = useCallback((winnerName: string) => {
    setWinner(winnerName);
    if (winnerName === 'You' && level < MAX_LEVEL) {
        setGameState(GameState.LevelComplete);
    } else {
        setGameState(GameState.GameOver);
    }
  }, [level]);

  const startGame = () => {
    setGameId(prevId => prevId + 1);
    setLevel(1);
    setWinner(null);
    setGameState(GameState.Playing);
  };

  const restartGame = () => {
    setGameId(prevId => prevId + 1);
    // Always restart from the beginning for a fresh game.
    setLevel(1);
    setWinner(null);
    setGameState(GameState.Playing);
  };

  const startNextLevel = () => {
    setGameId(prevId => prevId + 1);
    setLevel(prevLevel => prevLevel + 1);
    setWinner(null);
    setGameState(GameState.Playing);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.StartScreen:
        return (
          <div className="text-center">
            <h1 className="text-6xl font-bold text-yellow-300 mb-4" style={{fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>Duck Race</h1>
            <p className="text-xl text-cyan-200 mb-8">First duck to cross the finish line wins!</p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-105"
            >
              Start Race
            </button>
          </div>
        );
      case GameState.LevelComplete:
        const nextLevel = level + 1;
        let levelDescription = "";
        if (nextLevel === 2) {
            levelDescription = "Great job! Level 2 has garbage, don't touch it!";
        } else if (nextLevel === 3) {
            levelDescription = "Watch out! Level 3 has both logs and garbage!";
        }
        return (
            <div className="text-center bg-black bg-opacity-70 p-10 rounded-xl">
                <h2 className="text-5xl font-bold text-yellow-300 mb-4">Level {level} Complete!</h2>
                <p className="text-2xl text-white mb-6">{levelDescription}</p>
                <button
                onClick={startNextLevel}
                className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                >
                Start Level {nextLevel}
                </button>
            </div>
        );
      case GameState.GameOver:
        return (
          <div className="text-center bg-black bg-opacity-70 p-10 rounded-xl">
            <h2 className="text-5xl font-bold text-yellow-300 mb-4">Race Over!</h2>
            <p className="text-3xl text-white mb-6">
              {winner === 'You'
                ? level === MAX_LEVEL
                    ? `🎉 You beat all the levels! You're the champion! 🎉`
                    : `🎉 You Won Level ${level}! 🎉`
                : winner?.startsWith('Bot')
                ? `${winner} won!`
                : winner}
            </p>
            <button
              onClick={restartGame}
              className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition-transform transform hover:scale-105"
            >
              Race Again
            </button>
          </div>
        );
      case GameState.Playing:
        return <GameCanvas key={gameId} onGameEnd={handleGameEnd} level={level} />;
      default:
        return null;
    }
  };

  return (
    <main className="relative w-screen h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/1920/1080?blur=5')"}}>
       <div className="absolute inset-0 bg-blue-900 bg-opacity-40 backdrop-blur-sm"></div>
       <div className="relative z-10">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
