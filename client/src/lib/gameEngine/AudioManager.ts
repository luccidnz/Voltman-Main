export class AudioManager {
  private static backgroundMusic: HTMLAudioElement | null = null;
  private static hitSound: HTMLAudioElement | null = null;
  private static successSound: HTMLAudioElement | null = null;
  private static isMuted: boolean = false;

  public static async initialize(): Promise<void> {
    try {
      // Load background music
      this.backgroundMusic = new Audio('/sounds/background.mp3');
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = 0.3;

      // Load sound effects
      this.hitSound = new Audio('/sounds/hit.mp3');
      this.hitSound.volume = 0.5;

      this.successSound = new Audio('/sounds/success.mp3');
      this.successSound.volume = 0.6;

      console.log('Audio manager initialized');
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
    }
  }

  public static playBackgroundMusic(): void {
    if (this.backgroundMusic && !this.isMuted) {
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic.play().catch(error => {
        console.log('Background music play prevented:', error);
      });
    }
  }

  public static stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  public static pauseBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  public static resumeBackgroundMusic(): void {
    if (this.backgroundMusic && !this.isMuted) {
      this.backgroundMusic.play().catch(error => {
        console.log('Background music resume prevented:', error);
      });
    }
  }

  public static playHit(): void {
    if (this.hitSound && !this.isMuted) {
      const sound = this.hitSound.cloneNode() as HTMLAudioElement;
      sound.play().catch(error => {
        console.log('Hit sound play prevented:', error);
      });
    }
  }

  public static playSuccess(): void {
    if (this.successSound && !this.isMuted) {
      this.successSound.currentTime = 0;
      this.successSound.play().catch(error => {
        console.log('Success sound play prevented:', error);
      });
    }
  }

  public static toggleMute(): void {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.pauseBackgroundMusic();
    } else {
      this.resumeBackgroundMusic();
    }
    
    console.log(`Audio ${this.isMuted ? 'muted' : 'unmuted'}`);
  }

  public static setVolume(volume: number): void {
    volume = Math.max(0, Math.min(1, volume));
    
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = volume * 0.3;
    }
    if (this.hitSound) {
      this.hitSound.volume = volume * 0.5;
    }
    if (this.successSound) {
      this.successSound.volume = volume * 0.6;
    }
  }
}
