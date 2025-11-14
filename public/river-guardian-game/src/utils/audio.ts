import { GamePhase } from '../types';

type SfxType = 'click' | 'trash' | 'organism' | 'powerup' | 'gameOver' | 'combo' | 'healthLoss' | 'transition' | 'floodStart' | 'floodEnd';

class AudioManager {
    private audioCtx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private musicGain: GainNode | null = null;
    private sfxGain: GainNode | null = null;
    
    private isInitialized = false;
    private isMuted = false;
    
    private musicState: {
        oscillator: OscillatorNode | null,
        intervalId: number | null,
        notes: number[],
        noteIndex: number,
        bpm: number,
    } = {
        oscillator: null,
        intervalId: null,
        notes: [],
        noteIndex: 0,
        bpm: 120,
    };

    private riverHumSource: AudioBufferSourceNode | null = null;
    private lfo: OscillatorNode | null = null;

    public init(): boolean {
        if (this.isInitialized) return true;
        if (typeof window === 'undefined' || !(window.AudioContext || (window as any).webkitAudioContext)) {
             console.error("Web Audio API is not supported.");
             return false;
        }
        
        try {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.audioCtx.createGain();
            this.musicGain = this.audioCtx.createGain();
            this.sfxGain = this.audioCtx.createGain();

            this.masterGain.connect(this.audioCtx.destination);
            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            
            this.isInitialized = true;
            return true;
        } catch (e) {
            console.error("Failed to initialize AudioContext.", e);
            return false;
        }
    }
    
    private playNote(freq: number, duration: number, time: number, type: OscillatorType = 'sine', volume: number = 0.5, destination: AudioNode | null) {
        if (!this.audioCtx || !destination) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(destination);
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
    }
    
    public playSfx(type: SfxType, payload?: { multiplier?: number }) {
        if (!this.isInitialized) {
            if (!this.init()) return;
        }
        if (!this.audioCtx) return;

        const play = () => {
            if (!this.audioCtx) return;
            const time = this.audioCtx.currentTime;
            switch (type) {
                case 'click': this.playNote(880, 0.1, time, 'triangle', 0.3, this.sfxGain); break;
                case 'trash': this.playNote(784, 0.15, time, 'sine', 0.4, this.sfxGain); break;
                case 'organism': this.playNote(110, 0.3, time, 'sawtooth', 0.4, this.sfxGain); break;
                case 'powerup':
                    this.playNote(523, 0.1, time, 'triangle', 0.3, this.sfxGain);
                    this.playNote(659, 0.1, time + 0.1, 'triangle', 0.3, this.sfxGain);
                    this.playNote(784, 0.1, time + 0.2, 'triangle', 0.4, this.sfxGain);
                    break;
                case 'gameOver':
                    this.playNote(261, 0.2, time, 'square', 0.4, this.sfxGain);
                    this.playNote(196, 0.4, time + 0.25, 'square', 0.5, this.sfxGain);
                    break;
                case 'combo':
                    const multiplier = payload?.multiplier ?? 2;
                    switch (multiplier) {
                        case 2: // Two-note rise
                            this.playNote(523, 0.1, time, 'triangle', 0.4, this.sfxGain); // C5
                            this.playNote(659, 0.1, time + 0.05, 'triangle', 0.4, this.sfxGain); // E5
                            break;
                        case 3: // Three-note arpeggio
                            this.playNote(523, 0.1, time, 'triangle', 0.4, this.sfxGain); // C5
                            this.playNote(659, 0.1, time + 0.05, 'triangle', 0.4, this.sfxGain); // E5
                            this.playNote(784, 0.1, time + 0.1, 'triangle', 0.5, this.sfxGain); // G5
                            break;
                        case 4: // Faster, brighter arpeggio
                            this.playNote(523, 0.08, time, 'sine', 0.4, this.sfxGain); // C5
                            this.playNote(659, 0.08, time + 0.04, 'sine', 0.4, this.sfxGain); // E5
                            this.playNote(784, 0.08, time + 0.08, 'sine', 0.5, this.sfxGain); // G5
                            this.playNote(1046, 0.1, time + 0.12, 'sine', 0.5, this.sfxGain); // C6
                            break;
                        case 5: // Highest, most satisfying arpeggio with sparkle
                            this.playNote(1046, 0.08, time, 'triangle', 0.4, this.sfxGain); // C6
                            this.playNote(1318, 0.08, time + 0.04, 'triangle', 0.4, this.sfxGain); // E6
                            this.playNote(1568, 0.08, time + 0.08, 'triangle', 0.5, this.sfxGain); // G6
                            this.playNote(2093, 0.1, time + 0.12, 'triangle', 0.5, this.sfxGain); // C7
                             // Sparkle
                            this.playNote(4186, 0.15, time + 0.12, 'sine', 0.3, this.sfxGain); // C8
                            break;
                        default: // Fallback for multipliers beyond 5
                             this.playNote(1046, 0.15, time, 'triangle', 0.5, this.sfxGain);
                             break;
                    }
                    break;
                case 'healthLoss': this.playNote(150, 0.2, time, 'square', 0.4, this.sfxGain); break;
                case 'transition':
                    const osc = this.audioCtx.createOscillator();
                    const gainNode = this.audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, time);
                    osc.frequency.exponentialRampToValueAtTime(1600, time + 0.25);
                    gainNode.gain.setValueAtTime(0.3, time);
                    gainNode.gain.linearRampToValueAtTime(0, time + 0.25);
                    osc.connect(gainNode);
                    gainNode.connect(this.sfxGain);
                    osc.start(time);
                    osc.stop(time + 0.25);
                    break;
                case 'floodStart': {
                    const duration = 0.5; // Shorter for a 'splash' feel
                    const noiseBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * duration, this.audioCtx.sampleRate);
                    const output = noiseBuffer.getChannelData(0);
                    for (let i = 0; i < noiseBuffer.length; i++) {
                        output[i] = Math.random() * 2 - 1;
                    }
                    const noiseSource = this.audioCtx.createBufferSource();
                    noiseSource.buffer = noiseBuffer;

                    const filter = this.audioCtx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(1500, time);
                    filter.Q.setValueAtTime(0.8, time);
                    filter.frequency.exponentialRampToValueAtTime(400, time + duration);

                    const gain = this.audioCtx.createGain();
                    gain.gain.setValueAtTime(0, time);
                    gain.gain.linearRampToValueAtTime(0.5, time + 0.03); // Quick, sharp attack
                    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

                    noiseSource.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.sfxGain);
                    noiseSource.start(time);
                    noiseSource.stop(time + duration);
                    break;
                }
                case 'floodEnd': {
                    const dropOsc = this.audioCtx.createOscillator();
                    dropOsc.type = 'sine';
                    
                    const dropGain = this.audioCtx.createGain();

                    dropOsc.frequency.setValueAtTime(1200, time);
                    dropOsc.frequency.exponentialRampToValueAtTime(300, time + 0.2);

                    dropGain.gain.setValueAtTime(0.4, time);
                    dropGain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
                    
                    dropOsc.connect(dropGain);
                    dropGain.connect(this.sfxGain);

                    dropOsc.start(time);
                    dropOsc.stop(time + 0.3);
                    break;
                }
            }
        };

        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().then(play).catch(e => console.error("Audio resume failed", e));
        } else {
            play();
        }
    }
    
    public stopMusic() {
        if (this.musicState.intervalId) clearInterval(this.musicState.intervalId);
        if (this.musicState.oscillator) {
             try { this.musicState.oscillator.stop(); } catch(e) {}
        }
        this.musicState.oscillator = null;
        this.musicState.intervalId = null;

        if (this.riverHumSource) {
            try { this.riverHumSource.stop(); } catch(e) {}
        }
        if (this.lfo) {
            try { this.lfo.stop(); } catch(e) {}
        }
        this.riverHumSource = null;
        this.lfo = null;
    }

    private createRiverHum() {
        if (!this.audioCtx || !this.masterGain) return;

        const bufferSize = this.audioCtx.sampleRate * 2;
        const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        this.riverHumSource = this.audioCtx.createBufferSource();
        this.riverHumSource.buffer = noiseBuffer;
        this.riverHumSource.loop = true;

        const lowpassFilter = this.audioCtx.createBiquadFilter();
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.setValueAtTime(150, this.audioCtx.currentTime);

        this.lfo = this.audioCtx.createOscillator();
        this.lfo.type = 'sine';
        this.lfo.frequency.setValueAtTime(0.3, this.audioCtx.currentTime);

        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.setValueAtTime(50, this.audioCtx.currentTime);

        const humGain = this.audioCtx.createGain();
        humGain.gain.setValueAtTime(0.8, this.audioCtx.currentTime);

        this.riverHumSource.connect(lowpassFilter);
        lowpassFilter.connect(humGain);
        humGain.connect(this.masterGain);

        this.lfo.connect(lfoGain);
        lfoGain.connect(lowpassFilter.frequency);
        
        this.riverHumSource.start();
        this.lfo.start();
    }

    private _startMusicPlayback(type: 'menu' | 'game') {
        if (!this.audioCtx || !this.musicGain) return;
        this.stopMusic();
        this.createRiverHum();

        this.musicState.oscillator = this.audioCtx.createOscillator();
        this.musicState.oscillator.type = 'sine'; // Softer, more flute-like sound
        this.musicState.oscillator.connect(this.musicGain);
        this.musicGain.gain.value = 0.05; // Even quieter melody
        this.musicState.oscillator.start();
        this.musicState.noteIndex = 0;

        if (type === 'menu') {
            this.musicState.notes = [220, 261, 247, 329]; // A, C, B, E (mysterious)
            this.musicState.bpm = 60;
        } else { // game
            this.musicState.notes = [329, 349, 293, 329, 261, 293]; // E, F, D, E, C, D (mysterious)
            this.musicState.bpm = 120;
        }
        this.startMusicScheduler();
    }

    public playMusic(type: 'menu' | 'game') {
        if (!this.isInitialized) {
            if (!this.init()) return;
        }
        if (!this.audioCtx) return;

        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume()
                .then(() => this._startMusicPlayback(type))
                .catch(e => console.error("Audio resume failed in playMusic", e));
        } else {
            this._startMusicPlayback(type);
        }
    }
    
    private startMusicScheduler() {
        if (this.musicState.intervalId) clearInterval(this.musicState.intervalId);
        
        const noteDuration = 60000 / this.musicState.bpm;
        
        const playNextNote = () => {
            if (this.musicState.oscillator && this.audioCtx) {
                if (this.audioCtx.state === 'running') {
                    const note = this.musicState.notes[this.musicState.noteIndex];
                    this.musicState.oscillator.frequency.setValueAtTime(note, this.audioCtx.currentTime);
                    this.musicState.noteIndex = (this.musicState.noteIndex + 1) % this.musicState.notes.length;
                }
            }
        };

        this.musicState.intervalId = window.setInterval(playNextNote, noteDuration);
        playNextNote();
    }

    public setGamePhase(phase: GamePhase) {
        if (!this.musicState.oscillator) return;

        let newBPM: number;
        switch (phase) {
            case GamePhase.Learning: newBPM = 120; break;
            case GamePhase.RampUp: newBPM = 140; break;
            case GamePhase.Flood: newBPM = 180; break;
            case GamePhase.NormalLoop: newBPM = 150; break;
            default: return;
        }
        if (this.musicState.bpm !== newBPM) {
            this.musicState.bpm = newBPM;
            this.startMusicScheduler();
        }
    }

    public toggleMute(): boolean {
        if (!this.masterGain || !this.audioCtx) return this.isMuted;
        this.isMuted = !this.isMuted;
        const targetVolume = this.isMuted ? 0 : 1;
        this.masterGain.gain.linearRampToValueAtTime(targetVolume, this.audioCtx.currentTime + 0.1);
        return this.isMuted;
    }

    public getIsMuted = () => this.isMuted;
}

export const audioManager = new AudioManager();