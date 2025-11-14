import React, { useRef, useEffect, useCallback, useState } from 'react';
import { GameObject, GameResult, ObjectCategory, ObjectType, PowerUp, Particle, ExpandingRingEffect, MultiplierEffect, GamePhase, DebugInfo, FloodNotification } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, OBJECT_CONFIG, PHASE_CONFIG, EASY_TRASH, HARD_TRASH, EASY_ORGANISMS, HARD_ORGANISMS, GAME_CONFIG } from '../constants';
import { drawGameObject, drawWaterBackground, drawHitEffect, drawPowerUpEffect, loadAssets, drawParticles, drawExpandingRings, drawMultiplierEffect, drawCountdownText, drawFloodNotification, createStaticBackgroundCanvas } from '../utils/drawing';
import { audioManager } from '../utils/audio';
import { Pool } from '../utils/pool';

interface HitEffect { x: number; y: number; text: string; color: string; life: number; }
interface PowerUpEffect { x: number; y: number; radius: number; life: number; type: 'net' }

export interface GameState {
    score: number;
    survivalTime: number;
    multiplier: number;
    riverHealth: number;
}

interface GameCanvasProps {
    onGameEnd: (result: GameResult) => void;
    onStateUpdate: (state: GameState) => void;
    onDebugUpdate: (info: DebugInfo) => void;
    activatePowerUpRef: React.MutableRefObject<(powerUp: PowerUp) => void>;
    onPowerUpGained: (powerUp: PowerUp) => void;
    onPowerUpUsed: (powerUp: PowerUp) => void;
    isPaused: boolean;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const UI_UPDATE_INTERVAL = 100; // ms, update UI 10 times per second

export const GameCanvas: React.FC<GameCanvasProps> = ({ onGameEnd, onStateUpdate, onDebugUpdate, activatePowerUpRef, onPowerUpGained, onPowerUpUsed, isPaused }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
    
    // Active game elements
    const gameObjectsRef = useRef<GameObject[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const hitEffectsRef = useRef<HitEffect[]>([]);

    // Object Pools
    const gameObjectPoolRef = useRef<Pool<GameObject>>(new Pool<GameObject>(() => ({ id: 0, type: ObjectType.Bottle, x: 0, y: 0, width: 0, height: 0, rotation: 0, vx: 0, vy: 0, health: 1, maxHealth: 1 }), 50));
    const particlePoolRef = useRef<Pool<Particle>>(new Pool<Particle>(() => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, color: '', type: 'spark', rotation: 0, rotationSpeed: 0, gravityFactor: 1 }), 200));
    const hitEffectPoolRef = useRef<Pool<HitEffect>>(new Pool<HitEffect>(() => ({ x: 0, y: 0, text: '', color: '', life: 0 }), 30));

    const nextIdRef = useRef(0);
    const comboRef = useRef(0);
    const longestStreakRef = useRef(0);
    const trashCollectedRef = useRef(0);
    const organismsHitRef = useRef(0);
    const lastTimeRef = useRef<number | null>(null);
    const gameTimeRef = useRef(0);
    const spawnCooldownRef = useRef(1);
    const lastStateUpdateTimeRef = useRef(0);

    const countdownAnnouncedRef = useRef({3: false, 2: false, 1: false});

    // --- State managed in Refs for performance ---
    const scoreRef = useRef(0);
    const multiplierRef = useRef(1);
    const riverHealthRef = useRef(100);
    const survivalTimeRef = useRef(0);

    // Phase management
    const currentPhaseRef = useRef<GamePhase>(GamePhase.Countdown);
    const phaseTimeRef = useRef(0);
    const floodPhasesCompletedRef = useRef(0);
    const lastPhaseSpeedRef = useRef(0);
    const lastPhaseSpawnRef = useRef(0);
    const loopCountRef = useRef(0);

    const powerUpEffectsRef = useRef<PowerUpEffect[]>([]);
    const expandingRingsRef = useRef<ExpandingRingEffect[]>([]);
    const multiplierEffectRef = useRef<MultiplierEffect | null>(null);
    const countdownTextRef = useRef('');
    const floodNotificationRef = useRef<FloodNotification | null>(null);

    const [isGameOver, setIsGameOver] = useState(false);

    const createParticleBurst = useCallback((count: number, x: number, y: number, config: {
        type: Particle['type'],
        color: string | string[],
        minSpeed: number,
        maxSpeed: number,
        minSize: number,
        maxSize: number,
        life: number,
        gravity?: number,
    }) => {
        for (let i = 0; i < count; i++) {
            const p = particlePoolRef.current.get();
            const angle = Math.random() * Math.PI * 2;
            const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
            const color = Array.isArray(config.color) ? config.color[Math.floor(Math.random() * config.color.length)] : config.color;
            
            p.x = x;
            p.y = y;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.life = config.life;
            p.maxLife = config.life;
            p.size = config.minSize + Math.random() * (config.maxSize - config.minSize);
            p.color = color;
            p.type = config.type;
            p.rotation = Math.random() * Math.PI * 2;
            p.rotationSpeed = (Math.random() - 0.5) * 0.2;
            p.gravityFactor = config.gravity ?? 1;
            
            particlesRef.current.push(p);
        }
    }, []);

    const sendStateUpdate = useCallback(() => {
        onStateUpdate({
            score: scoreRef.current,
            survivalTime: survivalTimeRef.current,
            multiplier: multiplierRef.current,
            riverHealth: riverHealthRef.current,
        });
    }, [onStateUpdate]);

    useEffect(() => {
        if (isGameOver) {
            sendStateUpdate(); // Send final state before ending
            const result: GameResult = {
                score: scoreRef.current,
                longestStreak: longestStreakRef.current,
                trashCollected: trashCollectedRef.current,
                organismsHit: organismsHitRef.current,
                survivalTime: survivalTimeRef.current,
            };
            onGameEnd(result);
        }
    }, [isGameOver, onGameEnd, sendStateUpdate]);


    const chooseRandomObjectType = useCallback((mix: { [key in ObjectCategory]: number }): ObjectType => {
        const categoryRoll = Math.random();
        let chosenCategory: ObjectCategory = ObjectCategory.Trash;
        let cumulativeCategory = 0;
        for (const cat of [ObjectCategory.Trash, ObjectCategory.Organism, ObjectCategory.Neutral]) {
            cumulativeCategory += mix[cat];
            if (categoryRoll < cumulativeCategory) {
                chosenCategory = cat;
                break;
            }
        }
        
        const phase = currentPhaseRef.current;
        let possibleObjects: ObjectType[] = [];

        if (chosenCategory === ObjectCategory.Trash) {
             if (phase === GamePhase.Learning) {
                possibleObjects = EASY_TRASH;
            } else {
                // Weighted pool for harder trash types
                const weightedTrashPool = [
                    // Common trash (weight: 6)
                    ...Array(6).fill(ObjectType.Bottle),
                    ...Array(6).fill(ObjectType.Can),
                    ...Array(6).fill(ObjectType.Bag),
                    ...Array(6).fill(ObjectType.Barrel),
                    // Rarer trash
                    ...Array(3).fill(ObjectType.OilSpill),      // 2x rarer
                    ...Array(2).fill(ObjectType.Microplastic),  // 3x rarer
                ];
                // Return directly from the weighted pool
                return weightedTrashPool[Math.floor(Math.random() * weightedTrashPool.length)];
            }
        } else if (chosenCategory === ObjectCategory.Organism) {
            possibleObjects = (phase === GamePhase.Learning) ? EASY_ORGANISMS : [...EASY_ORGANISMS, ...HARD_ORGANISMS];
        } else { // Neutral
             possibleObjects = Object.entries(OBJECT_CONFIG)
                .filter(([, config]) => (config as { category: ObjectCategory }).category === chosenCategory)
                .map(([type]) => Number(type) as ObjectType);
        }
        
        if (possibleObjects.length === 0) { // Fallback
            return ObjectType.Bottle;
        }

        return possibleObjects[Math.floor(Math.random() * possibleObjects.length)];
    }, []);


    const addHealth = useCallback((amount: number) => {
        riverHealthRef.current = Math.min(GAME_CONFIG.RIVER_HEALTH_MAX, riverHealthRef.current + amount);
        if (amount > 0) {
            createParticleBurst(20, GAME_WIDTH/2, GAME_HEIGHT - 30, {
                type: 'heal', color: 'rgba(74, 222, 128, 0.7)', minSpeed: 1, maxSpeed: 4, minSize: 3, maxSize: 8, life: 60, gravity: -0.1
            });
        }
    }, [createParticleBurst]);

    const loseHealth = useCallback((amount: number) => {
        riverHealthRef.current = Math.max(0, riverHealthRef.current - amount);
        expandingRingsRef.current.push({
            x: GAME_WIDTH / 2, y: GAME_HEIGHT,
            radius: 0, maxRadius: GAME_WIDTH,
            life: 30, maxLife: 30,
            color: 'rgba(239, 68, 68, 0.7)', lineWidth: 15
        });

    }, []);

    const handleTap = useCallback((e: PointerEvent) => {
        if (isPaused || isGameOver || currentPhaseRef.current === GamePhase.Countdown) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const gameObjects = gameObjectsRef.current;
        // Iterate backwards to correctly handle removal and tap the top-most object first.
        for (let i = gameObjects.length - 1; i >= 0; i--) {
            const obj = gameObjects[i];
            const dx = obj.x - x;
            const dy = obj.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < Math.max(obj.width, obj.height) / 2) {
                const config = OBJECT_CONFIG[obj.type];

                obj.health -= 1;

                if (obj.health <= 0) {
                    // Remove object from active list and release to pool
                    const destroyedObj = gameObjects.splice(i, 1)[0];
                    gameObjectPoolRef.current.release(destroyedObj);

                    if (config.category === ObjectCategory.Trash) {
                        trashCollectedRef.current++;
                        comboRef.current++;
                        audioManager.playSfx('trash');
                        if (comboRef.current > longestStreakRef.current) {
                            longestStreakRef.current = comboRef.current;
                        }

                        if (comboRef.current > 0 && comboRef.current % GAME_CONFIG.COMBO_HEALTH_GAIN_THRESHOLD === 0) {
                            addHealth(GAME_CONFIG.COMBO_HEALTH_GAIN);
                            const effect = hitEffectPoolRef.current.get();
                            effect.x = obj.x; effect.y = obj.y; effect.text = `+${GAME_CONFIG.COMBO_HEALTH_GAIN} HP`; effect.color = 'text-green-400'; effect.life = 60;
                            hitEffectsRef.current.push(effect);
                        }

                        const basePoints = config.points;
                        const scoreGained = basePoints * multiplierRef.current;
                        scoreRef.current += scoreGained;

                        const effect = hitEffectPoolRef.current.get();
                        effect.x = obj.x; effect.y = obj.y; effect.text = `+${scoreGained}`; effect.color = 'text-cyan-300'; effect.life = 60;
                        hitEffectsRef.current.push(effect);
                        
                        // Particle effects
                        switch (obj.type) {
                            case ObjectType.Bottle: createParticleBurst(15, obj.x, obj.y, { type: 'shard', color: ['rgba(34, 197, 94, 0.8)', 'rgba(134, 239, 172, 0.8)'], minSpeed: 1, maxSpeed: 5, minSize: 3, maxSize: 8, life: 40 }); break;
                            case ObjectType.Can: createParticleBurst(20, obj.x, obj.y, { type: 'rust', color: ['#92400e', '#f97316', '#fed7aa'], minSpeed: 1, maxSpeed: 4, minSize: 2, maxSize: 5, life: 40 }); break;
                            case ObjectType.Bag: createParticleBurst(25, obj.x, obj.y, { type: 'plastic_bit', color: ['#e2e8f0', '#cbd5e1', '#94a3b8'], minSpeed: 0.5, maxSpeed: 2, minSize: 4, maxSize: 10, life: 50, gravity: 0.1 }); break;
                            case ObjectType.Barrel:
                                createParticleBurst(15, obj.x, obj.y, { type: 'spark', color: 'rgba(253, 224, 71, 1)', minSpeed: 2, maxSpeed: 5, minSize: 2, maxSize: 5, life: 35 });
                                createParticleBurst(10, obj.x, obj.y, { type: 'smoke', color: 'rgba(51, 65, 85, 0.5)', minSpeed: 0.5, maxSpeed: 2, minSize: 8, maxSize: 20, life: 45 });
                                break;
                            case ObjectType.OilSpill: createParticleBurst(25, obj.x, obj.y, { type: 'smoke', color: 'rgba(88, 28, 135, 0.6)', minSpeed: 0.5, maxSpeed: 2, minSize: 10, maxSize: 30, life: 50 }); break;
                            default: createParticleBurst(15, obj.x, y, { type: 'spark', color: 'rgba(253, 224, 71, 1)', minSpeed: 1, maxSpeed: 4, minSize: 2, maxSize: 4, life: 30 }); break;
                        }

                    } else if (config.category === ObjectCategory.Organism) {
                        organismsHitRef.current++;
                        comboRef.current = 0;
                        loseHealth(GAME_CONFIG.RIVER_HEALTH_PENALTY_ORGANISM);
                        audioManager.playSfx('organism');
                        const effect = hitEffectPoolRef.current.get();
                        effect.x = obj.x; effect.y = obj.y; effect.text = `-${GAME_CONFIG.RIVER_HEALTH_PENALTY_ORGANISM} HP`; effect.color = 'text-red-500'; effect.life = 60;
                        hitEffectsRef.current.push(effect);
                        createParticleBurst(20, obj.x, obj.y, { type: 'bubble', color: 'rgba(239, 68, 68, 0.7)', minSpeed: 0.5, maxSpeed: 2, minSize: 5, maxSize: 15, life: 40, gravity: -0.05 });

                    } else if (config.category === ObjectCategory.Neutral) {
                         createParticleBurst(10, obj.x, obj.y, { type: 'leaf_bit', color: ['#b45309', '#f97316'], minSpeed: 0.5, maxSpeed: 2, minSize: 4, maxSize: 10, life: 50, gravity: 0.2 });
                    }
                } else {
                    const effect = hitEffectPoolRef.current.get();
                    effect.x = x; effect.y = y; effect.text = `-1`; effect.color = 'text-yellow-300'; effect.life = 40;
                    hitEffectsRef.current.push(effect);
                    createParticleBurst(8, x, y, { type: 'gel', color: 'rgba(168, 85, 247, 0.5)', minSpeed: 0.2, maxSpeed: 1, minSize: 5, maxSize: 15, life: 25 });
                }

                // Since we hit an object, we can stop iterating for this tap event.
                break;
            }
        }

        // Update Multiplier
        const oldMultiplier = multiplierRef.current;
        let newMultiplier = 1;
        for (let i = GAME_CONFIG.MULTIPLIER_THRESHOLDS.length - 1; i >= 0; i--) {
            const threshold = GAME_CONFIG.MULTIPLIER_THRESHOLDS[i];
            if (comboRef.current >= threshold.combo) {
                newMultiplier = threshold.multiplier;
                break;
            }
        }
        multiplierRef.current = newMultiplier;

        if (multiplierRef.current > oldMultiplier) {
             multiplierEffectRef.current = { text: `x${multiplierRef.current}`, life: 60, maxLife: 60, x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 - 100 };
             audioManager.playSfx('combo', { multiplier: multiplierRef.current });
        }

    }, [isPaused, isGameOver, addHealth, loseHealth, createParticleBurst]);
    
    const activatePowerUp = useCallback((powerUp: PowerUp) => {
        onPowerUpUsed(powerUp);
        audioManager.playSfx('powerup');
        if (powerUp === 'net') {
             powerUpEffectsRef.current.push({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, radius: GAME_WIDTH / 2, life: 30, type: 'net' });
             
             const gameObjects = gameObjectsRef.current;
             for (let i = gameObjects.length - 1; i >= 0; i--) {
                 const obj = gameObjects[i];
                 const config = OBJECT_CONFIG[obj.type];
                 if (config.category === ObjectCategory.Trash) {
                    trashCollectedRef.current++;
                    const scoreGained = config.points * multiplierRef.current;
                    scoreRef.current += scoreGained;
                    
                    const effect = hitEffectPoolRef.current.get();
                    effect.x = obj.x; effect.y = obj.y; effect.text = `+${scoreGained}`; effect.color = 'text-cyan-300'; effect.life = 60;
                    hitEffectsRef.current.push(effect);

                    // Remove trash object and release to pool
                    const clearedObj = gameObjects.splice(i, 1)[0];
                    gameObjectPoolRef.current.release(clearedObj);
                 }
             }
        }
    }, [onPowerUpUsed]);

    useEffect(() => {
        activatePowerUpRef.current = activatePowerUp;
    }, [activatePowerUp]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.addEventListener('pointerdown', handleTap);
        return () => canvas.removeEventListener('pointerdown', handleTap);
    }, [handleTap]);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        let animationFrameId: number;
        
        if (!backgroundCanvasRef.current) {
            backgroundCanvasRef.current = createStaticBackgroundCanvas(GAME_WIDTH, GAME_HEIGHT);
        }

        const render = (time: number) => {
            if (lastTimeRef.current === null) {
                lastTimeRef.current = time;
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            const deltaTime = (time - lastTimeRef.current) / 1000;
            lastTimeRef.current = time;

            if (!isPaused && !isGameOver) {
                gameTimeRef.current += deltaTime;
                phaseTimeRef.current += deltaTime;
                survivalTimeRef.current = Math.floor(gameTimeRef.current);
                
                 if (floodNotificationRef.current) {
                    floodNotificationRef.current.life--;
                    if (floodNotificationRef.current.life <= 0) {
                        floodNotificationRef.current = null;
                    }
                }

                // Throttle UI updates
                if (time - lastStateUpdateTimeRef.current > UI_UPDATE_INTERVAL) {
                    sendStateUpdate();
                    lastStateUpdateTimeRef.current = time;
                }
                
                // --- Phase Management ---
                const phaseConfig = PHASE_CONFIG[currentPhaseRef.current];
                if (phaseTimeRef.current >= phaseConfig.duration) {
                    const oldPhase = currentPhaseRef.current;
                    phaseTimeRef.current = 0;
                    switch(currentPhaseRef.current) {
                        case GamePhase.Countdown: currentPhaseRef.current = GamePhase.Learning; break;
                        case GamePhase.Learning: currentPhaseRef.current = GamePhase.RampUp; break;
                        case GamePhase.RampUp:
                            currentPhaseRef.current = GamePhase.Flood;
                            const rampUpEnd = PHASE_CONFIG[GamePhase.RampUp];
                            lastPhaseSpeedRef.current = rampUpEnd.endSpeed!;
                            lastPhaseSpawnRef.current = rampUpEnd.endSpawn!;
                            break;
                        case GamePhase.Flood: 
                            currentPhaseRef.current = GamePhase.NormalLoop; 
                            floodPhasesCompletedRef.current++;
                            if (floodPhasesCompletedRef.current > 0 && floodPhasesCompletedRef.current % 2 === 0) {
                                onPowerUpGained('net');
                            }
                            break;
                        case GamePhase.NormalLoop: {
                            loopCountRef.current++;
                            currentPhaseRef.current = GamePhase.Flood;

                            const normalLoopConfig = PHASE_CONFIG[GamePhase.NormalLoop];
                            const rampUpConfig = PHASE_CONFIG[GamePhase.RampUp];
                            
                            const endedLoopIndex = loopCountRef.current - 1;
                            const baseSpeed = rampUpConfig.endSpeed! + (normalLoopConfig.speedIncrease! * endedLoopIndex);
                            const baseSpawn = rampUpConfig.endSpawn! + (normalLoopConfig.spawnIncrease! * endedLoopIndex);

                            const endOfLoopSpeedIncrease = 15;
                            const endOfLoopSpawnIncrease = 0.3;
                            
                            lastPhaseSpeedRef.current = baseSpeed + endOfLoopSpeedIncrease;
                            lastPhaseSpawnRef.current = baseSpawn + endOfLoopSpawnIncrease;
                            break;
                        }
                    }
                    if(oldPhase !== currentPhaseRef.current) {
                        audioManager.setGamePhase(currentPhaseRef.current);

                        if (currentPhaseRef.current === GamePhase.Flood) {
                            floodNotificationRef.current = {
                                text: `Powódź #${floodPhasesCompletedRef.current + 1}`,
                                life: 210, // 3.5 seconds
                                maxLife: 210,
                                type: 'start'
                            };
                            audioManager.playSfx('floodStart');
                        } else if (oldPhase === GamePhase.Flood) {
                             floodNotificationRef.current = {
                                text: `Koniec powodzi`,
                                life: 210,
                                maxLife: 210,
                                type: 'end'
                            };
                            audioManager.playSfx('floodEnd');
                        }
                    }
                }

                // --- Difficulty & Spawning ---
                let currentSpeed = 80;
                let currentSpawnRate = 1.0;
                let objectMix = PHASE_CONFIG[GamePhase.Learning].mix!;
                const currentPhase = currentPhaseRef.current;
                const currentPhaseConfig = PHASE_CONFIG[currentPhase];
                
                if (currentPhase === GamePhase.Countdown) {
                    const timeLeft = currentPhaseConfig.duration - phaseTimeRef.current;
                    if (timeLeft > 2) {
                        countdownTextRef.current = '3';
                        if (!countdownAnnouncedRef.current[3]) {
                            audioManager.playSfx('click');
                            countdownAnnouncedRef.current[3] = true;
                        }
                    }
                    else if (timeLeft > 1) {
                        countdownTextRef.current = '2';
                        if (!countdownAnnouncedRef.current[2]) {
                            audioManager.playSfx('click');
                            countdownAnnouncedRef.current[2] = true;
                        }
                    }
                    else if (timeLeft > 0) {
                        countdownTextRef.current = '1';
                        if (!countdownAnnouncedRef.current[1]) {
                            audioManager.playSfx('click');
                            countdownAnnouncedRef.current[1] = true;
                        }
                    }
                    else {
                        countdownTextRef.current = 'GO!';
                    }
                    if (timeLeft < -0.5) countdownTextRef.current = '';
                } else {
                    if(countdownAnnouncedRef.current[1] || countdownAnnouncedRef.current[2] || countdownAnnouncedRef.current[3]){
                         countdownAnnouncedRef.current = {3: false, 2: false, 1: false};
                    }
                    countdownTextRef.current = '';
                    switch (currentPhase) {
                        case GamePhase.Learning:
                        case GamePhase.RampUp:
                            const progress = phaseTimeRef.current / currentPhaseConfig.duration;
                            currentSpeed = lerp(currentPhaseConfig.startSpeed!, currentPhaseConfig.endSpeed!, progress);
                            currentSpawnRate = lerp(currentPhaseConfig.startSpawn!, currentPhaseConfig.endSpawn!, progress);
                            objectMix = currentPhaseConfig.mix!;
                            break;
                        case GamePhase.Flood:
                             currentSpeed = lastPhaseSpeedRef.current + currentPhaseConfig.speedBonus!;
                             currentSpawnRate = lastPhaseSpawnRef.current * currentPhaseConfig.spawnMultiplier!;
                             objectMix = currentPhaseConfig.mix!;
                             break;
                        case GamePhase.NormalLoop:
                            const rampUpEnd = PHASE_CONFIG[GamePhase.RampUp];
                            const baseSpeed = rampUpEnd.endSpeed! + (currentPhaseConfig.speedIncrease! * loopCountRef.current);
                            const baseSpawn = rampUpEnd.endSpawn! + (currentPhaseConfig.spawnIncrease! * loopCountRef.current);
                            const loopProgress = phaseTimeRef.current / currentPhaseConfig.duration;
                            currentSpeed = baseSpeed + loopProgress * 15;
                            currentSpawnRate = baseSpawn + loopProgress * 0.3;
                            objectMix = currentPhaseConfig.mix!;
                            break;
                    }

                    const mixString = `T:${(objectMix[ObjectCategory.Trash]*100).toFixed(0)} O:${(objectMix[ObjectCategory.Organism]*100).toFixed(0)} N:${(objectMix[ObjectCategory.Neutral]*100).toFixed(0)}`;
                    onDebugUpdate({
                        phase: GamePhase[currentPhase],
                        speed: currentSpeed,
                        spawnRate: currentSpawnRate,
                        mix: mixString,
                    });

                    spawnCooldownRef.current -= deltaTime;
                    if (spawnCooldownRef.current <= 0) {
                        spawnCooldownRef.current = 1 / currentSpawnRate;
                        const type = chooseRandomObjectType(objectMix);
                        const config = OBJECT_CONFIG[type];
                        let health = config.maxHealth || 1;
                        if (type === ObjectType.Microplastic) health = Math.floor(Math.random() * 3) + 3;
                        
                        const newObject = gameObjectPoolRef.current.get();
                        newObject.id = nextIdRef.current++;
                        newObject.type = type;
                        newObject.width = config.size.w;
                        newObject.height = config.size.h;
                        newObject.x = Math.random() * (GAME_WIDTH - config.size.w) + config.size.w / 2;
                        newObject.y = -config.size.h;
                        newObject.rotation = (Math.random() - 0.5) * 0.5;
                        newObject.vx = (Math.random() - 0.5) * 20;
                        newObject.vy = currentSpeed + (Math.random() - 0.5) * 20;
                        newObject.health = health;
                        newObject.maxHealth = health;
                        
                        gameObjectsRef.current.push(newObject);
                    }
                }
                
                // --- Update game objects ---
                for (let i = gameObjectsRef.current.length - 1; i >= 0; i--) {
                    const obj = gameObjectsRef.current[i];
                    obj.y += obj.vy * deltaTime;
                    obj.x += obj.vx * deltaTime;
                    obj.rotation += (obj.vx / 100) * deltaTime;
                
                    const halfWidth = obj.width / 2;
                    if (obj.x < halfWidth) {
                        obj.x = halfWidth;
                        obj.vx *= -1;
                    } else if (obj.x > GAME_WIDTH - halfWidth) {
                        obj.x = GAME_WIDTH - halfWidth;
                        obj.vx *= -1;
                    }
                
                    if (obj.y > GAME_HEIGHT + obj.height) {
                        const config = OBJECT_CONFIG[obj.type];
                        if (config.category === ObjectCategory.Trash) {
                            const damage = Math.ceil(config.points / GAME_CONFIG.TRASH_MISS_PENALTY_DIVISOR);
                            audioManager.playSfx('healthLoss');
                            loseHealth(damage);
                            const effect = hitEffectPoolRef.current.get();
                            effect.x = obj.x; effect.y = GAME_HEIGHT - 40; effect.text = `-${damage} HP`; effect.color = 'text-red-500'; effect.life = 60;
                            hitEffectsRef.current.push(effect);
                
                            if (comboRef.current > 0) {
                                comboRef.current = 0;
                                multiplierRef.current = 1;
                            }
                        }
                        const offscreenObj = gameObjectsRef.current.splice(i, 1)[0];
                        gameObjectPoolRef.current.release(offscreenObj);
                    }
                }

                if (riverHealthRef.current <= 0 && !isGameOver) {
                    setIsGameOver(true);
                }

                // Update particles
                for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                    const p = particlesRef.current[i];
                    p.x += p.vx * deltaTime;
                    p.y += p.vy * deltaTime;
                    p.vy += 40 * (p.gravityFactor ?? 1) * deltaTime;
                    if (p.rotationSpeed) p.rotation = (p.rotation || 0) + p.rotationSpeed;
                    p.life -= 1;
                    if (p.life <= 0) {
                        const deadParticle = particlesRef.current.splice(i, 1)[0];
                        particlePoolRef.current.release(deadParticle);
                    }
                }
                
                // Update hit effects
                for (let i = hitEffectsRef.current.length - 1; i >= 0; i--) {
                    const effect = hitEffectsRef.current[i];
                    effect.life--;
                    if (effect.life <= 0) {
                        const deadEffect = hitEffectsRef.current.splice(i, 1)[0];
                        hitEffectPoolRef.current.release(deadEffect);
                    }
                }
                
                // Update power-up effects
                for (let i = powerUpEffectsRef.current.length - 1; i >= 0; i--) {
                    const effect = powerUpEffectsRef.current[i];
                    effect.life--;
                    if (effect.life <= 0) {
                        powerUpEffectsRef.current.splice(i, 1);
                    }
                }
                
                // Update expanding rings
                for (let i = expandingRingsRef.current.length - 1; i >= 0; i--) {
                    const r = expandingRingsRef.current[i];
                    r.radius += (r.maxRadius - r.radius) * 0.1;
                    r.life--;
                    if (r.life <= 0) {
                        expandingRingsRef.current.splice(i, 1);
                    }
                }
                
                if (multiplierEffectRef.current) {
                    multiplierEffectRef.current.life--;
                    if (multiplierEffectRef.current.life <= 0) multiplierEffectRef.current = null;
                }
            }

            // --- Drawing ---
            ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
            if (backgroundCanvasRef.current) {
                drawWaterBackground(ctx, gameTimeRef.current, 60, backgroundCanvasRef.current);
            }
            gameObjectsRef.current.forEach(obj => drawGameObject(ctx, obj));
            drawParticles(ctx, particlesRef.current);
            drawExpandingRings(ctx, expandingRingsRef.current);
            hitEffectsRef.current.forEach(effect => drawHitEffect(ctx, effect));
            powerUpEffectsRef.current.forEach(effect => drawPowerUpEffect(ctx, effect));
            if (multiplierEffectRef.current) drawMultiplierEffect(ctx, multiplierEffectRef.current);
            
            if (floodNotificationRef.current) {
                drawFloodNotification(ctx, floodNotificationRef.current);
            }
            
            if (countdownTextRef.current) {
                const timeLeftInSecond = (PHASE_CONFIG[GamePhase.Countdown].duration - phaseTimeRef.current) % 1;
                drawCountdownText(ctx, countdownTextRef.current, timeLeftInSecond);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        // --- Effect Body ---
        animationFrameId = requestAnimationFrame(render);

        if (isPaused || isGameOver) {
            audioManager.stopMusic();
        } else {
            loadAssets(() => {
                audioManager.init();
                audioManager.playMusic('game');
                audioManager.setGamePhase(currentPhaseRef.current);
            });
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            audioManager.stopMusic();
        };
    }, [isPaused, isGameOver, loseHealth, sendStateUpdate, onPowerUpGained, addHealth, activatePowerUp, chooseRandomObjectType, onGameEnd, onDebugUpdate, createParticleBurst]);
    
    return <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} className="w-full h-full" />;
};
