import fs from 'fs-extra';
import { AudioStatus, StatusChangeCallback } from './types';

export class LocalAudio {
  private privSrc = '';

  private privPath = '';

  private privAudio = new Audio();

  private privStatusChangeCallbacks = new Set<StatusChangeCallback>();

  private audioSubscription?: { remove: () => void };

  constructor(src?: string) {
    if (src) {
      this.src = src;
    }
  }

  set src(src: string) {
    this.privPath = src;
    this.privSrc = `file://${src}`;
    this.setupAudioListener();
  }

  private async setupAudioListener() {
    const handleEnd = () => {
      this.stop();
    };
    this.privAudio.addEventListener('ended', handleEnd);
    this.audioSubscription = {
      remove: () => {
        this.privAudio.removeEventListener('ended', handleEnd);
      },
    };
  }

  private set status(value: AudioStatus) {
    this.privStatusChangeCallbacks.forEach((item) => item(value));
  }

  async play() {
    this.status = AudioStatus.playing;
    const [exists, stat] = await Promise.all([
      fs.pathExists(this.privPath),
      fs.stat(this.privPath),
    ]);
    if (exists && stat.size > 0) {
      this.privAudio.src = this.privSrc;
      this.privAudio.play();
    }
  }

  stop() {
    this.status = AudioStatus.stopped;
    this.privAudio.pause();
    this.privAudio.currentTime = 0;
  }

  pause() {
    this.status = AudioStatus.paused;
    this.privAudio.pause();
  }

  addStatusChangeListener(callback: StatusChangeCallback) {
    this.privStatusChangeCallbacks.add(callback);

    return {
      remove: () => {
        this.privStatusChangeCallbacks.delete(callback);
      },
    };
  }
}
