

import React, { useRef, useEffect, useCallback } from 'react';
import { FluidSimulator } from '../services/fluidSimulator';
import { Duck, Obstacle, PlayerType, Splash, ObstacleType } from '../types';
import * as C from '../constants';

interface GameCanvasProps {
  onGameEnd: (winnerName: string) => void;
  level: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameEnd, level }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fluidRef = useRef<FluidSimulator | null>(null);
  const ducksRef = useRef<Duck[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const splashesRef = useRef<Splash[]>([]);
  const animationFrameId = useRef<number>(0);
  const lastObstacleSpawnTime = useRef<number>(0);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [splashStrength, setSplashStrength] = React.useState(C.SPLASH_STRENGTH);
  const lastFrameTime = useRef<number>(performance.now());

  const createSplash = useCallback((simX: number, simY: number, strength: number) => {
    // A splash creates a visual effect and a wave that pushes nearby ducks.
    splashesRef.current.push({ x: simX, y: simY, radius: 10, opacity: 1 });

    ducksRef.current.forEach(duck => {
        if (duck.stunned > 0) return; // Don't affect stunned ducks
        const dx = duck.x - simX;
        const dy = duck.y - simY;
        const dist = Math.hypot(dx, dy);
        
        // Only affect ducks within the splash radius
        if (dist > 0.01 && dist < C.SPLASH_EFFECT_RADIUS) {
            // Apply a repulsive force with falloff based on distance
            const falloff = 1 - (dist / C.SPLASH_EFFECT_RADIUS);
            duck.vx += (dx / dist) * strength * falloff;
            duck.vy += (dy / dist) * strength * falloff;
        }
    });
  }, []);

  const spawnObstacle = useCallback(() => {
    let obstacleType: ObstacleType;
    if (level === 1) {
        obstacleType = ObstacleType.Log;
    } else if (level === 2) {
        obstacleType = ObstacleType.Garbage;
    } else { // Level 3+
        obstacleType = Math.random() < 0.5 ? ObstacleType.Log : ObstacleType.Garbage;
    }

    const obstacle: Obstacle = {
      id: Date.now() + Math.random(),
      x: -0.1 * C.SIM_WIDTH, // Spawn off-screen to the left
      y: C.SIM_HEIGHT * (0.1 + Math.random() * 0.8),
      vx: 0,
      vy: 0,
      width: 0.08 + Math.random() * 0.07,
      height: 0.03 + Math.random() * 0.02,
      angle: Math.random() * Math.PI * 2,
      type: obstacleType,
    };
    obstaclesRef.current.push(obstacle);
  }, [level]);

  const initializeGame = useCallback(() => {
    setIsGameOver(false);
    splashesRef.current = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const simWidth = C.CANVAS_WIDTH / C.C_SCALE;
    const domainHeight = C.SIM_HEIGHT;
    const h = domainHeight / C.RESOLUTION;
    const numY = C.RESOLUTION;
    const numX = Math.floor(simWidth / h);

    fluidRef.current = new FluidSimulator(1000.0, numX, numY, h);

    ducksRef.current = [];
    const playerColors = ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'];
    const playerNames = ['You', 'Bot Alice', 'Bot Bob'];
    const takenPositions = new Set<number>();

    for (let i = 0; i < C.NUM_PLAYERS; i++) {
        const startX = 0.1 * C.SIM_WIDTH;
        let startY;
        do {
            startY = C.SIM_HEIGHT * (0.2 + Math.random() * 0.6);
        } while (takenPositions.has(Math.floor(startY * 10)));
        takenPositions.add(Math.floor(startY * 10));

        ducksRef.current.push({
            id: i,
            name: playerNames[i],
            x: startX,
            y: startY,
            startX: startX,
            startY: startY,
            vx: 0,
            vy: 0,
            color: playerColors[i],
            type: i === 0 ? PlayerType.Human : PlayerType.Bot,
            splashCooldown: 0,
            stunned: 0,
        });
    }

    obstaclesRef.current = [];
    lastObstacleSpawnTime.current = performance.now();
  }, [level]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);

    // --- Draw fluid flow ---
    const fluid = fluidRef.current;
    if (fluid) {
        const h = fluid.h;
        for (let i = 0; i < fluid.numX; i++) {
            for (let j = 0; j < fluid.numY; j++) {
                // The m field is the "smoke" or "dye". It's 1 for still water, 0 for the inlet.
                const smokeDensity = fluid.m[i][j];
                // We visualize where the "dye" has traveled.
                const alpha = (1 - smokeDensity) * 0.15; // Make flow visible but not overpowering
                if (alpha > 0.01) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    const x = i * h * C.C_SCALE;
                    const y = j * h * C.C_SCALE;
                    const size = h * C.C_SCALE;
                    ctx.fillRect(x, y, size, size);
                }
            }
        }
    }
    // --- End Draw fluid flow ---

    // Draw finish line
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    const finishLineCanvasX = C.FINISH_LINE_X * C.CANVAS_WIDTH;
    ctx.moveTo(finishLineCanvasX, 0);
    ctx.lineTo(finishLineCanvasX, C.CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw obstacles
    obstaclesRef.current.forEach(obs => {
        ctx.save();
        ctx.translate(obs.x * C.C_SCALE, obs.y * C.C_SCALE);
        ctx.rotate(obs.angle);
        if (obs.type === ObstacleType.Log) {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-obs.width / 2 * C.C_SCALE, -obs.height / 2 * C.C_SCALE, obs.width * C.C_SCALE, obs.height * C.C_SCALE);
        } else { // Garbage
            ctx.fillStyle = '#556B2F'; // Dark olive green
            ctx.beginPath();
            ctx.arc(0, 0, obs.width/2 * C.C_SCALE, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(128, 128, 128, 0.7)';
            ctx.beginPath();
            ctx.arc(obs.width/4 * C.C_SCALE, -obs.width/5 * C.C_SCALE, obs.width/6 * C.C_SCALE, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    });

    // Draw splashes
    splashesRef.current.forEach(splash => {
        ctx.strokeStyle = `rgba(255, 255, 255, ${splash.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(splash.x * C.C_SCALE, splash.y * C.C_SCALE, splash.radius, 0, 2 * Math.PI);
        ctx.stroke();
    });

    // Draw ducks
    ducksRef.current.forEach(duck => {
        ctx.save();
        ctx.translate(duck.x * C.C_SCALE, duck.y * C.C_SCALE);
        const angle = Math.atan2(duck.vy, duck.vx);
        ctx.rotate(angle);

        // Body
        ctx.fillStyle = duck.color;
        ctx.beginPath();
        ctx.arc(0, 0, C.DUCK_SIZE, 0, 2 * Math.PI);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(C.DUCK_SIZE - 2, 0);
        ctx.lineTo(C.DUCK_SIZE + 10, -4);
        ctx.lineTo(C.DUCK_SIZE + 10, 4);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(C.DUCK_SIZE / 2, -C.DUCK_SIZE / 3, 2, 0, 2 * Math.PI);
        ctx.fill();

        // Stunned effect
        if (duck.stunned > 0) {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            const dizzyRadius = C.DUCK_SIZE * 0.8;
            ctx.beginPath();
            ctx.arc(0, -C.DUCK_SIZE, dizzyRadius, Math.PI * 1.5, Math.PI * 1.5 + (Math.PI * 2 * (duck.stunned / C.STUN_DURATION)));
            ctx.stroke();
        }

        ctx.restore();
    });

    if (isGameOver) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
        ctx.fillStyle = "#DC2626"; // Red-600
        const signSize = 100;
        ctx.beginPath();
        ctx.moveTo(C.CANVAS_WIDTH / 2 + signSize, C.CANVAS_HEIGHT / 2);
        for(let i=1; i<=8; i++) {
            const angle = i * Math.PI/4;
            ctx.lineTo(C.CANVAS_WIDTH / 2 + signSize * Math.cos(angle), C.CANVAS_HEIGHT / 2 + signSize * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 80px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("STOP", C.CANVAS_WIDTH / 2, C.CANVAS_HEIGHT / 2);
        ctx.restore();
    }
  }, [isGameOver, level]);


  const update = useCallback((currentTime: number) => {
    const deltaTime = (currentTime - lastFrameTime.current) / 1000;
    lastFrameTime.current = currentTime;
    const fluid = fluidRef.current;
    if (!fluid) return;

    if (!isGameOver) {
        // Update splashes animation
        splashesRef.current = splashesRef.current.map(s => ({
            ...s,
            radius: s.radius + C.SPLASH_RADIUS_RATE * deltaTime,
            opacity: s.opacity - C.SPLASH_OPACITY_RATE * deltaTime,
        })).filter(s => s.opacity > 0);

        fluid.simulate(C.DT, 0.0, C.NUM_ITERS, C.OVER_RELAXATION, C.FLOW_VELOCITY, currentTime / 1000.0);

        // Spawn obstacles
        if (currentTime - lastObstacleSpawnTime.current > C.OBSTACLE_SPAWN_RATE && obstaclesRef.current.length < C.MAX_OBSTACLES) {
            spawnObstacle();
            lastObstacleSpawnTime.current = currentTime;
        }

        // Update ducks
        ducksRef.current.forEach(duck => {
            if (duck.stunned > 0) {
                duck.stunned = Math.max(0, duck.stunned - deltaTime);
                duck.vx *= 0.95; // Slow down when stunned
                duck.vy *= 0.95;
            } else {
                 if (duck.type === PlayerType.Bot && duck.splashCooldown <= 0) {
                    const AVOID_DISTANCE = 0.25; // sim units

                    const sortedObstacles = obstaclesRef.current
                        .filter(obs => obs.x > duck.x && (obs.x - duck.x) < AVOID_DISTANCE)
                        .sort((a,b) => Math.hypot(a.x - duck.x, a.y - duck.y) - Math.hypot(b.x - duck.x, b.y - duck.y));
                    const closestObstacle = sortedObstacles.length > 0 ? sortedObstacles[0] : null;
                    
                    let splashReason = 'none';
                    let splashX = 0, splashY = 0;

                    // Reason 1: Avoid obstacle
                    if (closestObstacle && Math.hypot(closestObstacle.x - duck.x, closestObstacle.y - duck.y) < AVOID_DISTANCE) {
                        splashReason = 'avoid';
                        splashX = closestObstacle.x;
                        splashY = closestObstacle.y;
                    } else {
                        // Reason 2: Catch up
                        const leadingDuckX = Math.max(...ducksRef.current.map(d => d.x));
                        if (duck.x < leadingDuckX - 0.02 * C.SIM_WIDTH) { // Splash if not in the lead pack
                            splashReason = 'propel';
                            splashX = duck.x - (0.1 + Math.random() * 0.05);
                            // Steer towards center
                            const steerDirection = Math.sign(C.SIM_HEIGHT / 2 - duck.y);
                            splashY = duck.y - steerDirection * (0.05 + Math.random() * 0.1);
                        }
                    }

                    if (splashReason !== 'none') {
                        duck.splashCooldown = C.SPLASH_COOLDOWN * (1.2 + Math.random());
                        const boost = (splashReason === 'avoid') ? C.BOT_SPLASH_STRENGTH * 1.2 : C.BOT_SPLASH_STRENGTH;
                        createSplash(splashX, splashY, boost);
                    }
                }
            }

            duck.splashCooldown = Math.max(0, duck.splashCooldown - deltaTime);

            const fluidVx = fluid.sampleField(duck.x, duck.y, 0, fluid.u);
            const fluidVy = fluid.sampleField(duck.x, duck.y, 1, fluid.v);

            duck.vx += fluidVx * C.FLUID_FORCE_FACTOR;
            duck.vy += fluidVy * C.FLUID_FORCE_FACTOR;

            duck.vx *= C.DAMPING_FACTOR;
            duck.vy *= C.DAMPING_FACTOR;

            duck.x += duck.vx * C.DT;
            duck.y += duck.vy * C.DT;

            // Boundary collision
            if (duck.y < 0.05 * C.SIM_HEIGHT) { duck.y = 0.05 * C.SIM_HEIGHT; duck.vy *= -0.5; }
            if (duck.y > 0.95 * C.SIM_HEIGHT) { duck.y = 0.95 * C.SIM_HEIGHT; duck.vy *= -0.5; }
        });

        // Update obstacles
        obstaclesRef.current = obstaclesRef.current.filter(obs => obs.x < C.SIM_WIDTH * 1.1); // Remove obstacles that go off-screen right
        obstaclesRef.current.forEach(obs => {
            const fluidVx = fluid.sampleField(obs.x, obs.y, 0, fluid.u);
            const fluidVy = fluid.sampleField(obs.x, obs.y, 1, fluid.v);
            obs.vx += fluidVx * C.OBSTACLE_FLUID_FORCE_FACTOR;
            obs.vy += fluidVy * C.OBSTACLE_FLUID_FORCE_FACTOR;
            obs.vx *= 0.99;
            obs.vy *= 0.99;
            obs.x += obs.vx * C.DT;
            obs.y += obs.vy * C.DT;
        });

        // Collision detection
        const ducksToRemove = new Set<number>();
        for (const duck of ducksRef.current) {
            for (const obs of obstaclesRef.current) {
                const dist = Math.hypot(duck.x - obs.x, duck.y - obs.y);
                if (dist < (C.DUCK_SIZE / C.C_SCALE + obs.width / 2)) {
                    if (obs.type === ObstacleType.Log) {
                        duck.stunned = C.STUN_DURATION;
                        duck.vx *= -0.5; // Bounce off
                    } else if (obs.type === ObstacleType.Garbage) {
                        if (level >= 2) {
                            duck.x = duck.startX;
                            duck.y = duck.startY;
                            duck.vx = 0;
                            duck.vy = 0;
                            duck.stunned = C.STUN_DURATION;
                        } else {
                            if (duck.type === PlayerType.Human) {
                                setIsGameOver(true);
                                onGameEnd('You hit the garbage!');
                                return; // Exit update loop
                            } else {
                                ducksToRemove.add(duck.id);
                            }
                        }
                    }
                }
            }
        }

        if (ducksToRemove.size > 0) {
            ducksRef.current = ducksRef.current.filter(d => !ducksToRemove.has(d.id));
        }

        // Win condition
        const winner = ducksRef.current.find(d => d.x / C.SIM_WIDTH >= C.FINISH_LINE_X);
        if (winner) {
            setIsGameOver(true);
            onGameEnd(winner.name);
            return;
        }
    }

    draw();
    animationFrameId.current = requestAnimationFrame(update);
  }, [isGameOver, onGameEnd, draw, spawnObstacle, level, createSplash]);

  useEffect(() => {
    initializeGame();
    lastFrameTime.current = performance.now();
    animationFrameId.current = requestAnimationFrame(update);

    const canvas = canvasRef.current;
    const handleClick = (e: MouseEvent) => {
        if (isGameOver || !canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        const scaleX = C.CANVAS_WIDTH / rect.width;
        const scaleY = C.CANVAS_HEIGHT / rect.height;
        const simX = (e.clientX - rect.left) * scaleX / C.C_SCALE;
        const simY = (e.clientY - rect.top) * scaleY / C.C_SCALE;

        // Check if an obstacle was clicked to remove it
        const clickedObstacle = obstaclesRef.current.find(obs => Math.hypot(simX - obs.x, simY - obs.y) < obs.width / 2);
        if (clickedObstacle) {
            obstaclesRef.current = obstaclesRef.current.filter(obs => obs.id !== clickedObstacle.id);
            return; // Obstacle removed, action is done.
        }

        const playerDuck = ducksRef.current.find(d => d.type === PlayerType.Human);
        if (!playerDuck || playerDuck.stunned > 0 || playerDuck.splashCooldown > 0) return;
        playerDuck.splashCooldown = C.SPLASH_COOLDOWN;

        createSplash(simX, simY, splashStrength);
    };
    
    canvas?.addEventListener('click', handleClick);
    
    return () => {
        cancelAnimationFrame(animationFrameId.current);
        canvas?.removeEventListener('click', handleClick);
    };
  }, [initializeGame, update, isGameOver, splashStrength, createSplash]);

  return (
    <div className="flex flex-col items-center">
        <div className="text-white bg-black bg-opacity-50 px-4 py-2 rounded-t-lg flex justify-between items-center" style={{width: C.CANVAS_WIDTH}}>
            <div>
                <h2 className="text-xl font-bold text-yellow-300">Level {level}</h2>
                <p className="text-sm text-cyan-100">Click the water to splash. Click an obstacle to remove it!</p>
            </div>
            <div className="flex flex-col items-center text-white ml-4">
                <label htmlFor="splashStrength" className="text-sm font-bold text-yellow-300 mb-1">
                    Splash Strength: <span className="font-mono w-8 inline-block text-right">{splashStrength.toFixed(1)}</span>
                </label>
                <input
                    id="splashStrength"
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={splashStrength}
                    onChange={(e) => setSplashStrength(parseFloat(e.target.value))}
                    className="w-48 cursor-pointer accent-yellow-400"
                    aria-label="Adjust splash strength"
                />
            </div>
        </div>
        <canvas
            ref={canvasRef}
            width={C.CANVAS_WIDTH}
            height={C.CANVAS_HEIGHT}
            className="bg-blue-800 bg-opacity-80 border-4 border-yellow-400 rounded-b-lg shadow-2xl"
        />
    </div>
  );
};

export default GameCanvas;