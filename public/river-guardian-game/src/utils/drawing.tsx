import { GameObject, ObjectType, Particle, ExpandingRingEffect, MultiplierEffect, FloodNotification } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, OBJECT_GRAPHICS_URLS } from '../constants';

// --- Asset Loading System ---
const imageCache = new Map<ObjectType, HTMLImageElement>();
let assetsLoaded = false;
let onAssetsLoadedCallback: (() => void) | null = null;

export const loadAssets = (callback: () => void) => {
    if (assetsLoaded) {
        callback();
        return;
    }
    
    onAssetsLoadedCallback = callback;

    const promises: Promise<void>[] = [];
    
    for (const [typeStr, url] of Object.entries(OBJECT_GRAPHICS_URLS)) {
        const type = Number(typeStr) as ObjectType;
        const promise = new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                imageCache.set(type, img);
                resolve();
            };
            img.onerror = () => {
                console.error(`Failed to load image for ObjectType: ${ObjectType[type]} from ${url}`);
                resolve(); 
            }
            img.src = url as string;
        });
        promises.push(promise);
    }

    Promise.all(promises).then(() => {
        assetsLoaded = true;
        if (onAssetsLoadedCallback) {
            onAssetsLoadedCallback();
        }
    }).catch(error => {
        console.error("Asset loading failed", error);
    });
};

// --- Cached Water Patterns ---
// PERFORMANCE FIX: Create patterns once and reuse them.
// Creating canvas elements and patterns on every frame is extremely expensive.
let waterPattern1: CanvasPattern | null = null;
let waterPattern2: CanvasPattern | null = null;
let smokeParticleImage: HTMLCanvasElement | null = null;
const tintedSmokeCache = new Map<string, HTMLCanvasElement>();


const createWaterPatterns = (ctx: CanvasRenderingContext2D) => {
    // Pattern 1 (Slower, thicker waves)
    const patternCanvas1 = document.createElement('canvas');
    patternCanvas1.width = 64;
    patternCanvas1.height = 64;
    const pctx1 = patternCanvas1.getContext('2d')!;
    pctx1.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    pctx1.lineWidth = 1.5;
    for (let i = -10; i < 64; i+=20) {
        pctx1.beginPath();
        pctx1.moveTo(i, -10);
        pctx1.bezierCurveTo(i + 30, 32, i - 30, 32, i, 74);
        pctx1.stroke();
    }
    waterPattern1 = ctx.createPattern(patternCanvas1, 'repeat');

    // Pattern 2 (Faster, thinner waves)
    const patternCanvas2 = document.createElement('canvas');
    patternCanvas2.width = 64;
    patternCanvas2.height = 64;
    const pctx2 = patternCanvas2.getContext('2d')!;
    pctx2.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    pctx2.lineWidth = 1.0;
    for (let i = -10; i < 64; i+=20) {
        pctx2.beginPath();
        pctx2.moveTo(i, -10);
        pctx2.bezierCurveTo(i + 30, 32, i - 30, 32, i, 74);
        pctx2.stroke();
    }
    waterPattern2 = ctx.createPattern(patternCanvas2, 'repeat');
};

const createSmokeParticleImage = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const size = 32;
    canvas.width = size;
    canvas.height = size;
    const smokeCtx = canvas.getContext('2d')!;
    const grad = smokeCtx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    smokeCtx.fillStyle = grad;
    smokeCtx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    smokeCtx.fill();
    return canvas;
}

const getOrCreateTintedSmoke = (color: string): HTMLCanvasElement => {
    if (tintedSmokeCache.has(color)) {
        return tintedSmokeCache.get(color)!;
    }

    if (!smokeParticleImage) {
        smokeParticleImage = createSmokeParticleImage();
    }

    const canvas = document.createElement('canvas');
    canvas.width = smokeParticleImage.width;
    canvas.height = smokeParticleImage.height;
    const ctx = canvas.getContext('2d')!;

    // Draw the white smoke base
    ctx.drawImage(smokeParticleImage, 0, 0);
    
    // Use 'source-in' to tint the smoke with the desired color
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    tintedSmokeCache.set(color, canvas);
    return canvas;
}

export const createStaticBackgroundCanvas = (width: number, height: number): HTMLCanvasElement => {
    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = width;
    bgCanvas.height = height;
    const bgCtx = bgCanvas.getContext('2d')!;
    
    // Draw the static gradient
    const gradient = bgCtx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#06b6d4');
    gradient.addColorStop(1, '#082f49');
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, width, height);
    
    return bgCanvas;
};


export const drawWaterBackground = (ctx: CanvasRenderingContext2D, time: number, gameSpeed: number = 60, staticBackground: HTMLCanvasElement) => {
    // Create patterns on first draw if they don't exist
    if (!waterPattern1 || !waterPattern2) {
        createWaterPatterns(ctx);
    }
    
    ctx.save();
    // Base gradient is now drawn from the pre-rendered canvas
    ctx.drawImage(staticBackground, 0, 0);

    // Light reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    const reflectionY = -100 + Math.sin(time * 0.5) * 50;
    const reflectionHeight = 300;
    ctx.beginPath();
    ctx.ellipse(GAME_WIDTH / 2, reflectionY, GAME_WIDTH * 0.8, reflectionHeight, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scrolling parallax waves using cached patterns
    // Layer 1
    if (waterPattern1) {
        ctx.globalAlpha = 0.2;
        const speed = gameSpeed * 0.3;
        const offsetY = (time * speed) % 64;
        ctx.fillStyle = waterPattern1;
        ctx.translate(0, offsetY);
        ctx.fillRect(0, -64, GAME_WIDTH, GAME_HEIGHT + 64);
        ctx.translate(0, -offsetY);
    }

    // Layer 2
    if (waterPattern2) {
        ctx.globalAlpha = 0.15;
        const speed = gameSpeed * 0.5;
        const offsetY = (time * speed) % 64;
        ctx.fillStyle = waterPattern2;
        ctx.translate(0, offsetY);
        ctx.fillRect(0, -64, GAME_WIDTH, GAME_HEIGHT + 64);
        ctx.translate(0, -offsetY);
    }

    ctx.restore();
};

export const drawGameObject = (ctx: CanvasRenderingContext2D, obj: GameObject) => {
    const img = imageCache.get(obj.type);
    if (!img) {
        // Fallback drawing if image not found
        ctx.fillStyle = 'purple';
        ctx.fillRect(obj.x - obj.width/2, obj.y - obj.height/2, obj.width, obj.height);
        return;
    }

    ctx.save();
    ctx.translate(obj.x, obj.y);
    ctx.rotate(obj.rotation);
    
    if (obj.type === ObjectType.OilSpill || obj.type === ObjectType.Microplastic) {
        ctx.globalAlpha = 0.6 + (obj.health / obj.maxHealth) * 0.4;
    }
    
    ctx.drawImage(img, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
    
    ctx.restore();
};


export const drawHitEffect = (ctx: CanvasRenderingContext2D, effect: {x:number, y:number, text: string, color:string, life:number}) => {
    ctx.save();
    const alpha = Math.min(1, effect.life / 30);
    const color = effect.color.replace('text-', ''); // simple parse
    const [r, g, b] = getColorValues(color).split(', ').map(Number);
    
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    
    const isNegative = color.includes('red');
    const x = effect.x + (isNegative ? (Math.random() - 0.5) * 4 : 0);
    const y = effect.y - (60 - effect.life) * 0.8 + (isNegative ? (Math.random() - 0.5) * 4 : 0);
    
    // Fake shadow (cheap)
    ctx.fillStyle = `rgba(0,0,0, ${alpha * 0.5})`;
    ctx.fillText(effect.text, x + 2, y + 2);

    // Main text
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fillText(effect.text, x, y);
    
    ctx.restore();
}

const getColorValues = (colorName: string) => {
    const colors: Record<string, string> = {
        'green-400': '74, 222, 128',
        'red-500': '239, 68, 68',
        'yellow-300': '253, 224, 71',
        'cyan-300': '103, 232, 249',
        'orange-400': '251, 146, 60',
    };
    return colors[colorName] || '255, 255, 255';
}

export const drawPowerUpEffect = (ctx: CanvasRenderingContext2D, effect: {x:number, y:number, radius: number, life:number, type: 'net'}) => {
    ctx.save();
    const progress = 1 - effect.life / 30; // 0 -> 1
    const alpha = Math.sin(progress * Math.PI); // Fade in and out
    
    if (effect.type === 'net') {
        const finalRadius = effect.radius * 1.2; // make it a bit bigger
        const currentRadius = finalRadius * progress;
        const numRadialLines = 12;
        const numConcentricCircles = 5;

        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.lineWidth = 2.5 * (1 - progress); // Net gets thinner as it expands

        if (ctx.lineWidth <= 0) {
            ctx.restore();
            return;
        }

        // Draw concentric circles
        for (let i = 1; i <= numConcentricCircles; i++) {
            ctx.beginPath();
            const radius = currentRadius * (i / numConcentricCircles);
            ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Draw radial lines
        for (let i = 0; i < numRadialLines; i++) {
            const angle = (i / numRadialLines) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(effect.x, effect.y);
            ctx.lineTo(
                effect.x + Math.cos(angle) * currentRadius,
                effect.y + Math.sin(angle) * currentRadius
            );
            ctx.stroke();
        }
    }

    ctx.restore();
}

export const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    ctx.save();
    particles.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        
        if (p.type === 'shard') {
            ctx.fillStyle = p.color;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation || 0);
            ctx.beginPath();
            // Draw a sharp, irregular triangle shape for shards
            ctx.moveTo(0, -p.size * 0.7);
            ctx.lineTo(p.size * 0.6, p.size * 0.7);
            ctx.lineTo(-p.size * 0.6, p.size * 0.7);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        } else if (p.type === 'smoke') {
            const tintedImage = getOrCreateTintedSmoke(p.color);
            ctx.save();
            const particleSize = p.size * 2.5 * (0.5 + alpha * 0.5); // Shrink as it fades
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation || 0);
            ctx.globalAlpha = alpha;
            ctx.drawImage(tintedImage, -particleSize / 2, -particleSize / 2, particleSize, particleSize);
            ctx.restore();
        } else if (p.type === 'bubble') {
            ctx.strokeStyle = p.color.replace(/rgba\(([^,]+,[^,]+,[^,]+),[^)]+\)/, `rgba($1, ${alpha * 1.5})`);
            ctx.fillStyle = p.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = alpha * 0.5; // Inner shine
            ctx.beginPath();
            ctx.arc(p.x + p.size * 0.2, p.y - p.size * 0.2, p.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'leaf_bit') {
            ctx.fillStyle = p.color;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation || 0);
            ctx.beginPath();
            ctx.moveTo(0, -p.size/2);
            ctx.quadraticCurveTo(p.size/2, 0, 0, p.size/2);
            ctx.quadraticCurveTo(-p.size/2, 0, 0, -p.size/2);
            ctx.fill();
            ctx.restore();
        } else if (p.type === 'gel') {
            const currentSize = p.size * (p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'rust') {
            ctx.fillStyle = p.color;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation || 0);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        } else if (p.type === 'plastic_bit') {
            ctx.fillStyle = p.color;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation || 0);
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 0.6);
            ctx.lineTo(p.size * 0.5, p.size * 0.2);
            ctx.lineTo(0, p.size * 0.6);
            ctx.lineTo(-p.size * 0.5, p.size * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        else {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.restore();
};

export const drawExpandingRings = (ctx: CanvasRenderingContext2D, rings: ExpandingRingEffect[]) => {
    ctx.save();
    rings.forEach(r => {
        const progress = 1 - r.life / r.maxLife;
        const alpha = Math.sin(progress * Math.PI); // Fade in and out
        
        ctx.strokeStyle = r.color.replace(/, [0-9\.]+\)/, `, ${alpha})`); // Manually set alpha
        ctx.lineWidth = r.lineWidth * (1 - progress);
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
    });
    ctx.restore();
};

export const drawMultiplierEffect = (ctx: CanvasRenderingContext2D, effect: MultiplierEffect) => {
    ctx.save();
    
    const lifeProgress = effect.life / effect.maxLife; // 1 -> 0
    const animationProgress = 1 - lifeProgress; // 0 -> 1
    const baseFadeOutAlpha = lifeProgress < 0.4 ? (lifeProgress / 0.4) : 1;
    const multiplierValue = parseInt(effect.text.charAt(1));

    let scale: number;
    let alpha: number;
    let fontSize: number;
    let fillStyle: string | CanvasGradient;

    switch (multiplierValue) {
        case 2: // Green
            scale = 1 + Math.min(1, animationProgress / 0.5) * 0.2;
            alpha = baseFadeOutAlpha * 0.25;
            fontSize = 55;
            fillStyle = '#34d399';
            break;
        case 3: // Yellow
            scale = 1 + Math.min(1, animationProgress / 0.5) * 0.3;
            alpha = baseFadeOutAlpha * 0.375;
            fontSize = 55;
            fillStyle = '#facc15';
            break;
        case 4: // Orange
            scale = 1 + Math.min(1, animationProgress / 0.5) * 0.4;
            alpha = baseFadeOutAlpha * 0.5;
            fontSize = 55;
            fillStyle = '#fb923c';
            break;
        case 5: // Red (Flame)
            scale = 1 + Math.min(1, animationProgress / 0.4) * 0.8;
            alpha = baseFadeOutAlpha * 0.55;
            fontSize = 80; // Reduced by 33% from 120
            
            const gradient = ctx.createLinearGradient(0, effect.y - 40, 0, effect.y + 40);
            gradient.addColorStop(0, '#f87171');
            gradient.addColorStop(1, '#b91c1c');
            fillStyle = gradient;
            break;
        default:
            ctx.restore();
            return;
    }

    ctx.globalAlpha = alpha;
    ctx.font = `bold ${fontSize * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Fake shadow
    ctx.fillStyle = `rgba(0,0,0, ${alpha * 0.5})`;
    if (multiplierValue === 5) {
        const flickerX = (Math.random() - 0.5) * 6;
        const flickerY = (Math.random() - 0.5) * 6;
        ctx.fillText(effect.text, effect.x + flickerX + 4, effect.y + flickerY + 4);
    } else {
        ctx.fillText(effect.text, effect.x + 3, effect.y + 3);
    }

    // Main text
    ctx.fillStyle = fillStyle;
    if (multiplierValue === 5) {
        const flickerX = (Math.random() - 0.5) * 3;
        const flickerY = (Math.random() - 0.5) * 3;
        ctx.fillText(effect.text, effect.x + flickerX, effect.y + flickerY);
    } else {
        ctx.fillText(effect.text, effect.x, effect.y);
    }
    
    ctx.restore();
}

export const drawCountdownText = (ctx: CanvasRenderingContext2D, text: string, timeInSecond: number) => {
    ctx.save();
    
    // timeInSecond goes from 1 down to 0
    const scale = 1.0 + (1.0 - timeInSecond) * 0.5; // Scale up from 1.0 to 1.5
    const alpha = timeInSecond > 0.2 ? 1.0 : timeInSecond / 0.2; // Fade out in the last 20%
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${120 * scale}px sans-serif`;
    
    ctx.globalAlpha = alpha;
    
    // Fake shadow
    ctx.fillStyle = `rgba(0,0,0, ${alpha * 0.4})`;
    ctx.fillText(text, GAME_WIDTH / 2 + 3, GAME_HEIGHT / 2 - 47);

    // Main text
    ctx.fillStyle = 'white';
    ctx.fillText(text, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);

    ctx.restore();
};

export const drawFloodNotification = (ctx: CanvasRenderingContext2D, notification: FloodNotification) => {
    ctx.save();
    
    const lifeProgress = notification.life / notification.maxLife; // 1 -> 0
    const animationProgress = 1 - lifeProgress;

    const alpha = notification.life > notification.maxLife * 0.6
        ? Math.min(1, animationProgress / 0.2) // Fade in for first 20% of life
        : lifeProgress / 0.6; // Fade out for remaining 60% of life

    if (alpha <= 0) {
        ctx.restore();
        return;
    }
    
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold 45px sans-serif`;

    const x = GAME_WIDTH / 2;
    const y = GAME_HEIGHT / 6;

    // Fake shadow
    ctx.fillStyle = `rgba(0,0,0, ${alpha * 0.4})`;
    ctx.fillText(notification.text, x + 2, y + 2);
    
    // Main text
    ctx.fillStyle = '#e0f2fe'; // A very light, bright blue
    ctx.fillText(notification.text, x, y);

    ctx.restore();
};