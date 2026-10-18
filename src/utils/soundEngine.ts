/**
 * Pure Web Audio API acoustic sound effects & warm solo-piano background music engine.
 * Features a note-for-note solo piano arrangement of the uploaded 58-second waltz
 * ("Married Life" from Up — slow lyrical piano arrangement) extended with a gentle
 * second movement (~92 seconds per cycle), voiced at a warm, intimate background volume,
 * plus tactile paper page-turn acoustics.
 */

const N = {
  // Deep Piano Left-Hand Bass (Octave 2 & 3)
  Eb2: 77.78, G2: 98.00, Ab2: 103.83, A2: 110.00, Bb2: 116.54, B2: 123.47,
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  // Middle Register & Left-Hand Waltz Chords (Octave 4)
  C4: 261.63, Cs4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  // Right-Hand Lyrical Piano Melody (Octave 5 & 6)
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, D6: 1174.66, G6: 1567.98,
};

/**
 * Note-for-note transcription of the uploaded solo piano audio ("Married Life" slow piano waltz)
 * plus a gentle nocturnal reprise so the full cycle spans ~92 seconds seamlessly.
 */
export const BGM_MELODY: Array<{ note: number; harmony?: number; bass?: number; beats: number }> = [
  // ============================================================================
  // SECTION I (0:02–0:14): Delicate High Piano Arpeggio Intro (Gmaj9 <-> Cmaj7/G)
  // ============================================================================
  // Phrase 1: G4 - D5 - F#5 - A5 - B5 (sustained)
  { note: N.G4, beats: 0.65 },
  { note: N.D5, beats: 0.65 },
  { note: N.Fs5, beats: 0.65 },
  { note: N.A5, beats: 0.65 },
  { note: N.B5, harmony: N.D5, bass: N.G3, beats: 3.2 },

  // Phrase 2: G4 - E5 - G5 - C6 (sustained)
  { note: N.G4, beats: 0.65 },
  { note: N.E5, beats: 0.65 },
  { note: N.G5, beats: 0.65 },
  { note: N.C6, harmony: N.E5, bass: N.G3, beats: 3.5 },

  // Phrase 3: G4 - D5 - F#5 - A5 - B5 - D5 - F#5 - A5 - B5
  { note: N.G4, beats: 0.58 },
  { note: N.D5, beats: 0.58 },
  { note: N.Fs5, beats: 0.58 },
  { note: N.A5, beats: 0.58 },
  { note: N.B5, harmony: N.D5, beats: 0.85 },
  { note: N.D5, beats: 0.58 },
  { note: N.Fs5, beats: 0.58 },
  { note: N.A5, beats: 0.58 },
  { note: N.B5, harmony: N.Fs4, bass: N.G3, beats: 1.9 },

  // Phrase 4: G4 - E5 - G5 - C6 ... C6
  { note: N.G4, beats: 0.62 },
  { note: N.E5, beats: 0.62 },
  { note: N.G5, beats: 0.62 },
  { note: N.C6, harmony: N.E5, bass: N.G3, beats: 2.2 },
  { note: N.C6, harmony: N.G5, beats: 3.2 },

  // ============================================================================
  // SECTION II (0:14–0:24): Main Waltz Theme A1 (Right-Hand Melody + Left-Hand Waltz)
  // ============================================================================
  // Pickup + Measure 1-2: B4 - D5 - E5 - D5 over G2 - D3 - G3 - A3 - B3
  { note: N.B4, beats: 0.65 },
  { note: N.D5, beats: 0.65 },
  { note: N.E5, beats: 0.65 },
  { note: N.D5, harmony: N.G3, bass: N.G2, beats: 0.85 },
  { note: N.D4, harmony: N.G3, beats: 0.8 },
  { note: N.A3, harmony: N.D4, beats: 0.8 },
  { note: N.B3, harmony: N.G4, beats: 1.5 },

  // Pickup + Measure 3-4: B4 - D5 - E5 - C5 over G2 - D3 - G3 - B3 - C4
  { note: N.B4, beats: 0.65 },
  { note: N.D5, beats: 0.65 },
  { note: N.E5, beats: 0.65 },
  { note: N.C5, harmony: N.E4, bass: N.G2, beats: 0.85 },
  { note: N.D4, harmony: N.G3, beats: 0.8 },
  { note: N.B3, harmony: N.G4, beats: 0.8 },
  { note: N.C4, harmony: N.E4, beats: 1.5 },

  // Pickup + Measure 5-6: A4 - B4 - C5 over Am7 (A2 - E3 - A3 - B3)
  { note: N.A4, beats: 0.65 },
  { note: N.B4, beats: 0.65 },
  { note: N.C5, harmony: N.E4, bass: N.A2, beats: 0.9 },
  { note: N.E4, harmony: N.A3, beats: 0.8 },
  { note: N.B3, harmony: N.E4, beats: 0.9 },

  // Measure 7-8: C5 - D5 - D5 - B4 over D7 -> Gmaj7
  { note: N.C5, harmony: N.E4, bass: N.E3, beats: 0.75 },
  { note: N.D5, harmony: N.Fs4, bass: N.D3, beats: 0.85 },
  { note: N.D5, harmony: N.A4, bass: N.Fs3, beats: 0.85 },
  { note: N.B4, harmony: N.D4, bass: N.G2, beats: 0.9 },
  { note: N.D4, harmony: N.G3, beats: 0.8 },
  { note: N.A3, harmony: N.D4, beats: 0.8 },
  { note: N.B3, harmony: N.G4, beats: 1.5 },

  // ============================================================================
  // SECTION III (0:24–0:34): Main Waltz Theme A2 (Second Statement with Warm Harmony)
  // ============================================================================
  // Pickup + Measure 9-10: B4 - D5 - E5 - D5
  { note: N.B4, beats: 0.65 },
  { note: N.D5, beats: 0.65 },
  { note: N.E5, beats: 0.65 },
  { note: N.D5, harmony: N.B4, bass: N.G2, beats: 0.85 },
  { note: N.D4, harmony: N.G3, beats: 0.8 },
  { note: N.A3, harmony: N.D4, beats: 0.8 },
  { note: N.B3, harmony: N.G4, beats: 1.5 },

  // Pickup + Measure 11-12: B4 - D5 - E5 - C5
  { note: N.B4, beats: 0.65 },
  { note: N.D5, beats: 0.65 },
  { note: N.E5, beats: 0.65 },
  { note: N.C5, harmony: N.G4, bass: N.G2, beats: 0.85 },
  { note: N.D4, harmony: N.G3, beats: 0.8 },
  { note: N.B3, harmony: N.G4, beats: 0.8 },
  { note: N.C4, harmony: N.E4, beats: 1.5 },

  // Pickup + Measure 13-14: A4 - B4 - C5 over Am7
  { note: N.A4, beats: 0.65 },
  { note: N.B4, beats: 0.65 },
  { note: N.C5, harmony: N.E4, bass: N.A2, beats: 0.9 },
  { note: N.E4, harmony: N.A3, beats: 0.8 },
  { note: N.B3, harmony: N.E4, beats: 0.9 },

  // Measure 15-16: C5 - D5 - D5 - B4 over D7 -> Gmaj7
  { note: N.C5, harmony: N.E4, bass: N.E3, beats: 0.75 },
  { note: N.D5, harmony: N.Fs4, bass: N.D3, beats: 0.85 },
  { note: N.D5, harmony: N.A4, bass: N.Fs3, beats: 0.85 },
  { note: N.B4, harmony: N.D4, bass: N.G2, beats: 0.9 },
  { note: N.D4, harmony: N.G3, beats: 0.8 },
  { note: N.A3, harmony: N.D4, beats: 0.8 },
  { note: N.B3, harmony: N.G4, beats: 1.5 },

  // ============================================================================
  // SECTION IV (0:34–0:53): Emotional Bridge (Cmaj7 -> Bm7 -> Bbmaj7 -> Am7 -> Abmaj7 -> Eb/G)
  // ============================================================================
  // 0:34: D5 - E5 - F#5 - G5 over Cmaj7 (C3 - G3 - C4 - D4 - E4)
  { note: N.D5, beats: 0.65 },
  { note: N.E5, beats: 0.65 },
  { note: N.Fs5, beats: 0.65 },
  { note: N.G5, harmony: N.B4, bass: N.C3, beats: 0.9 },
  { note: N.C4, harmony: N.G3, beats: 0.8 },
  { note: N.D4, harmony: N.G3, beats: 0.8 },
  { note: N.E4, harmony: N.C4, beats: 1.4 },

  // 0:37: A4 - D5 over Bm7 (B2 - F#3 - B3 - C#4 - D4)
  { note: N.A4, harmony: N.E4, beats: 0.85 },
  { note: N.D5, harmony: N.Fs4, bass: N.B2, beats: 0.95 },
  { note: N.B3, harmony: N.Fs3, beats: 0.8 },
  { note: N.Cs4, harmony: N.Fs3, beats: 0.8 },
  { note: N.D4, harmony: N.B3, beats: 1.4 },

  // 0:39: D5 - E5 - F5 over Bbmaj7 (Bb2 - F3 - Bb3 - D4)
  { note: N.D5, beats: 0.68 },
  { note: N.E5, beats: 0.68 },
  { note: N.F5, harmony: N.A4, bass: N.Bb2, beats: 0.95 },
  { note: N.Bb3, harmony: N.F3, beats: 0.8 },
  { note: N.C4, harmony: N.F3, beats: 0.8 },
  { note: N.D4, harmony: N.Bb3, beats: 1.4 },

  // 0:41: G5 - C5 over Am7 (A2 - E3 - A3 - B3 - C4)
  { note: N.G5, harmony: N.B4, beats: 0.9 },
  { note: N.C5, harmony: N.E4, bass: N.A2, beats: 0.95 },
  { note: N.A3, harmony: N.E3, beats: 0.8 },
  { note: N.B3, harmony: N.E3, beats: 0.8 },
  { note: N.C4, harmony: N.A3, beats: 1.4 },

  // 0:44: B4 - C5 - D5 - Eb5 over Abmaj7 (Ab2 - Eb3 - Ab3 - Bb3 - C4)
  { note: N.B4, beats: 0.65 },
  { note: N.C5, beats: 0.65 },
  { note: N.D5, beats: 0.65 },
  { note: N.Eb5, harmony: N.G4, bass: N.Ab2, beats: 0.95 },
  { note: N.Ab3, harmony: N.Eb3, beats: 0.8 },
  { note: N.Bb3, harmony: N.Eb3, beats: 0.8 },
  { note: N.C4, harmony: N.Ab3, beats: 1.4 },

  // 0:46: E5 - F5 - G5 over Eb/G (Eb2 - Bb2 - Eb3 - G3 - Bb3)
  { note: N.E5, beats: 0.68 },
  { note: N.F5, beats: 0.68 },
  { note: N.G5, harmony: N.Bb4, bass: N.Eb2, beats: 0.95 },
  { note: N.G3, harmony: N.Eb3, beats: 0.8 },
  { note: N.Bb3, harmony: N.Eb3, beats: 0.8 },
  { note: N.Eb4, harmony: N.Bb3, beats: 1.4 },

  // 0:49–0:53: F5 - G5 - E5 (octaves over C/E) -> F#5 fermata (over Ebdim7)
  { note: N.F5, harmony: N.F4, beats: 0.78 },
  { note: N.G5, harmony: N.G4, beats: 0.78 },
  { note: N.E5, harmony: N.C4, bass: N.E3, beats: 2.6 },
  { note: N.Fs5, harmony: N.C4, bass: N.Eb3, beats: 3.6 },

  // ============================================================================
  // SECTION V (0:53–0:58): Grand Cascading Gmaj9 Arpeggio Finale & Warm Reprise
  // ============================================================================
  { note: N.D5, beats: 0.75 },
  { note: N.B4, harmony: N.D4, bass: N.G2, beats: 0.75 },
  { note: N.D4, harmony: N.G3, beats: 0.45 },
  { note: N.G4, harmony: N.B3, beats: 0.45 },
  { note: N.B4, harmony: N.D4, beats: 0.45 },
  { note: N.D5, harmony: N.G4, beats: 0.45 },
  { note: N.G5, harmony: N.B4, beats: 0.48 },
  { note: N.B5, harmony: N.D5, beats: 0.52 },
  { note: N.D6, harmony: N.G5, beats: 0.58 },
  { note: N.G6, harmony: N.B5, bass: N.G3, beats: 3.8 },

  // Gentle Second-Verse Nocturnal Reprise (extends total cycle past 92 seconds seamlessly)
  { note: N.B4, harmony: N.G4, bass: N.G2, beats: 1.8 },
  { note: N.D5, harmony: N.Fs4, beats: 1.4 },
  { note: N.G5, harmony: N.B4, bass: N.E3, beats: 2.2 },
  { note: N.Fs5, harmony: N.A4, bass: N.D3, beats: 1.8 },
  { note: N.E5, harmony: N.G4, bass: N.C3, beats: 2.2 },
  { note: N.D5, harmony: N.Fs4, bass: N.B2, beats: 1.8 },
  { note: N.C5, harmony: N.E4, bass: N.A2, beats: 2.2 },
  { note: N.B4, harmony: N.D4, bass: N.D3, beats: 2.0 },

  // Quiet solo piano waltz variation in Gmaj7 -> Cmaj9 -> Am9 -> D13 -> Gmaj9
  { note: N.B4, beats: 0.7 },
  { note: N.D5, beats: 0.7 },
  { note: N.E5, beats: 0.7 },
  { note: N.D5, harmony: N.G4, bass: N.G2, beats: 2.4 },
  { note: N.B4, beats: 0.7 },
  { note: N.D5, beats: 0.7 },
  { note: N.E5, beats: 0.7 },
  { note: N.C5, harmony: N.E4, bass: N.C3, beats: 2.4 },
  { note: N.A4, beats: 0.75 },
  { note: N.B4, beats: 0.75 },
  { note: N.C5, harmony: N.E4, bass: N.A2, beats: 2.2 },
  { note: N.D5, harmony: N.Fs4, bass: N.D3, beats: 1.8 },
  { note: N.E5, harmony: N.G4, bass: N.C3, beats: 2.2 },
  { note: N.D5, harmony: N.Fs4, bass: N.B2, beats: 1.8 },
  { note: N.B4, harmony: N.D4, bass: N.E3, beats: 2.2 },
  { note: N.A4, harmony: N.C4, bass: N.A2, beats: 2.0 },
  { note: N.B4, harmony: N.D4, bass: N.D3, beats: 2.2 },
  { note: N.G4, harmony: N.B3, bass: N.G2, beats: 3.6 },
];

export const BGM_AUDIO_SRC = '/shinchan-bgm.mp3';
export const BGM_DEFAULT_VOLUME = 0.60;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmPlaying: boolean = false;
  private bgmPausedForSongRoom: boolean = false;

  constructor() {
    try {
      const saved = sessionStorage.getItem('rishika_sound_muted');
      if (saved === 'true') this.muted = true;
    } catch {
      // Ignore storage errors
    }
  }

  private getBgmAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return null;
    if (!this.bgmAudio) {
      const audio = new Audio(BGM_AUDIO_SRC);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = BGM_DEFAULT_VOLUME;
      this.bgmAudio = audio;
    }
    return this.bgmAudio;
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public isBgmActive(): boolean {
    return !this.muted && this.bgmPlaying && !this.bgmPausedForSongRoom;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    try {
      sessionStorage.setItem('rishika_sound_muted', String(this.muted));
    } catch {
      // Ignore
    }
    if (this.muted) {
      this.stopBackgroundMusic();
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    } else {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.playTap();
      this.startBackgroundMusic();
    }
    return this.muted;
  }

  /** Immediately stop or resume background music when the dedicated song room is played */
  public setSongRoomPlaying(playing: boolean): void {
    this.bgmPausedForSongRoom = playing;
    if (playing) {
      this.stopBackgroundMusic();
    } else if (!this.muted) {
      this.startBackgroundMusic();
    }
  }

  /** Plays the original uploaded piano cover audio file (/shinchan-bgm.mp3) directly */
  public startBackgroundMusic(): void {
    if (this.muted || this.bgmPausedForSongRoom || typeof window === 'undefined') return;
    const audio = this.getBgmAudio();
    if (!audio) return;
    audio.volume = BGM_DEFAULT_VOLUME;
    audio.muted = false;
    if (!audio.paused && this.bgmPlaying) return;
    const playPromise = audio.play();
    this.bgmPlaying = true;
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        this.bgmPlaying = !audio.paused;
      });
    }
  }

  public stopBackgroundMusic(): void {
    this.bgmPlaying = false;
    if (this.bgmAudio) {
      try {
        this.bgmAudio.pause();
      } catch {
        // Ignore audio errors
      }
    }
  }

  /** Tactile paper page-turn rustle + soft felt grace note when flipping between chapters */
  public playPageTurn(direction: 'forward' | 'backward' = 'forward'): void {
    this.startBackgroundMusic();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const duration = 0.24;

      // Soft filtered noise burst to emulate cotton-rag paper leaf turning
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env * 0.35;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.Q.setValueAtTime(1.8, now);
      if (direction === 'forward') {
        bandpass.frequency.setValueAtTime(620, now);
        bandpass.frequency.exponentialRampToValueAtTime(1180, now + duration);
      } else {
        bandpass.frequency.setValueAtTime(1120, now);
        bandpass.frequency.exponentialRampToValueAtTime(580, now + duration);
      }

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.065, now + 0.05);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + duration + 0.02);

      // Subtle warm wooden spine resonance
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(direction === 'forward' ? 392 : 349.23, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(direction === 'forward' ? 523.25 : 293.66, now + 0.14);

      bodyGain.gain.setValueAtTime(0.001, now);
      bodyGain.gain.linearRampToValueAtTime(0.042, now + 0.025);
      bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.16);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(ctx.destination);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.17);
    } catch {
      // Ignore audio errors
    }
  }

  /** Soft warm kalimba/paper tap for button clicks */
  public playTap(): void {
    this.startBackgroundMusic();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.065);

      gain.gain.setValueAtTime(0.085, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);
    } catch {
      // Ignore audio errors
    }
  }

  /** Playful pitch-gliding cat boop / dodge sound */
  public playCatBoop(variant: 'happy' | 'sassy' = 'happy'): void {
    this.startBackgroundMusic();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';

      if (variant === 'happy') {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      } else {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(293.66, now + 0.14);
      }

      gain.gain.setValueAtTime(0.095, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  /** Ascending pentatonic celesta note for planting flowers or adding bouquet stems */
  public playBloomNote(stepIndex: number = 0): void {
    this.startBackgroundMusic();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
      const freq = scale[Math.abs(stepIndex) % scale.length];
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      sub.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      sub.frequency.setValueAtTime(freq * 0.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.095, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.55);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 0.58);
      sub.stop(now + 0.58);
    } catch {
      // Ignore
    }
  }

  /** Warm major-7th harp shimmer for white-heart pulse, wax seal break, or bouquet completion */
  public playHeartShimmer(): void {
    this.startBackgroundMusic();
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.055;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.075, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.72);
      });
    } catch {
      // Ignore
    }
  }

  /** Ultra-soft felt key tick for letter typing */
  public playSoftKeyTick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + Math.random() * 45, now);
      gain.gain.setValueAtTime(0.018, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.022);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
