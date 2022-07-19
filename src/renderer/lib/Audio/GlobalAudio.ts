import fs from 'fs-extra';
import { AudioStatus, StatusChangeCallback } from './types';

export class GlobalAudio {
  private privSrc = '';

  private privPath = '';

  private privFsWatcher?: fs.FSWatcher;

  private privAudio = new Audio();

  private privStatus = AudioStatus.empty;

  private privTs = Date.now();

  private privStatusChangeCallbacks = new Set<StatusChangeCallback>();

  private audioSubscription?: { remove: () => void };

  private getStreamEnd = async () => true;

  constructor() {
    this.privAudio.preload = 'none';
  }

  setSource(src: string, options?: { getStreamEnd?: () => Promise<boolean> }) {
    this.privPath = src;
    this.privSrc = `file://${src}`;
    this.getStreamEnd = options?.getStreamEnd || (async () => true);
    this.setupFileWatch();
    this.setupAudioListener();
  }

  private async setupFileWatch() {
    if (await this.getStreamEnd()) {
      return;
    }
    this.privFsWatcher?.close();
    let t = 0;
    this.privFsWatcher = fs.watch(this.privPath, async (event, filename) => {
      this.privTs = Date.now();
      const streamEnd = await this.getStreamEnd();
      const unplaying = this.privAudio.paused || this.privAudio.ended;
      if (streamEnd && this.privStatus === AudioStatus.playing && unplaying) {
        this.continuePlay();
        return;
      }
      const now = Date.now();
      if (now - t >= 1500) {
        t = now;
        if (this.privStatus === AudioStatus.playing && unplaying) {
          this.continuePlay();
        }
      }
    });
  }

  private async setupAudioListener() {
    const handleEnd = async () => {
      // console.log(this.privAudio.src);
      const playingTimestamp = Number(this.privAudio.src.split('?')[1]);
      if (
        (await this.getStreamEnd()) &&
        this.privAudio.ended &&
        playingTimestamp === this.privTs
      ) {
        this.status = AudioStatus.stopped;
        return;
      }
      if (this.privStatus === AudioStatus.playing) {
        this.continuePlay();
      }
    };
    this.privAudio.addEventListener('ended', handleEnd);
    this.audioSubscription = {
      remove: () => {
        this.privAudio.removeEventListener('ended', handleEnd);
      },
    };
  }

  private set status(value: AudioStatus) {
    this.privStatus = value;
    this.privStatusChangeCallbacks.forEach((item) => item(value));
  }

  private async continuePlay() {
    const { duration } = this.privAudio;
    // this.privAudio.currentTime = duration || 0;
    await this.play(duration);
  }

  async play(currentTime?: number) {
    this.status = AudioStatus.playing;
    const [exists, stat] = await Promise.all([
      fs.pathExists(this.privPath),
      fs.stat(this.privPath),
    ]);
    if (exists && stat.size > 0) {
      this.privAudio.src = `${this.privSrc}?${this.privTs}`;
      this.privAudio.currentTime = currentTime || 0;
      this.privAudio.load();
      await this.privAudio.play();
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
