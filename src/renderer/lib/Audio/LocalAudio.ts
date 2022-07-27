import { AudioStatus, StatusChangeCallback } from './types';

export class LocalAudio {
  private privAudio = new Audio();

  private privStatus = AudioStatus.empty;

  private privStatusChangeCallbacks = new Set<StatusChangeCallback>();

  setSource(src: string) {
    this.privAudio.src = `file://${src}`;
    this.privAudio.load();
    this.setupAudioListener();
  }

  private setupAudioListener() {
    const handleEnd = () => {
      this.status = AudioStatus.stopped;
    };
    this.privAudio.addEventListener('ended', handleEnd);
  }

  private set status(value: AudioStatus) {
    this.privStatus = value;
    this.privStatusChangeCallbacks.forEach((item) => item(value));
  }

  get status() {
    return this.privStatus;
  }

  async play() {
    this.status = AudioStatus.playing;
    await this.privAudio.play();
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
    callback(this.privStatus);
    return {
      remove: () => {
        this.privStatusChangeCallbacks.delete(callback);
      },
    };
  }
}
