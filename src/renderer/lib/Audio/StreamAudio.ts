import { AudioStatus, StatusChangeCallback } from './types';

export class StreamAudio {
  private privAudio = new Audio();

  private privStatus = AudioStatus.empty;

  private privChunks: ArrayBuffer[] = [];

  private privStatusChangeCallbacks = new Set<StatusChangeCallback>();

  private privSourceBuffer?: SourceBuffer;

  constructor() {
    this.reset();
    this.setupAudioListener();
  }

  appendStream(chunk: ArrayBuffer) {
    this.privChunks.push(chunk);
  }

  private setupAudioListener() {
    const handleEnd = () => {
      this.privStatus = AudioStatus.stopped;
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

  reset() {
    this.stop();
    this.privChunks = [];
    const mediaSource = new MediaSource();
    this.privAudio.src = URL.createObjectURL(mediaSource);
    mediaSource.onsourceopen = () => {
      this.privSourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
      this.privSourceBuffer.onupdate = () => {
        const chunk = this.privChunks.shift();
        if (chunk) {
          this.privSourceBuffer?.appendBuffer(chunk);
        }
      };
      this.privSourceBuffer.onupdateend = () => {
        mediaSource.endOfStream();
      };
    };
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
