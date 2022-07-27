import { AudioStatus, StatusChangeCallback } from './types';

export class StreamAudio {
  private privAudio = new Audio();

  private privStatus = AudioStatus.empty;

  private privBuffers: ArrayBuffer[] = [];

  private privStatusChangeCallbacks = new Set<StatusChangeCallback>();

  private privMediaSource?: MediaSource;

  private privSourceBuffer?: SourceBuffer;

  private privStreamEnd = false;

  constructor() {
    this.reset();
    this.setupAudioListener();
  }

  appendBuffer(buffer: ArrayBuffer) {
    this.privBuffers.push(buffer);
    this.updateSourceBuffer();
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

  private updateSourceBuffer() {
    if (
      this.privMediaSource?.readyState === 'open' &&
      !this.privSourceBuffer?.updating
    ) {
      const buffer = this.privBuffers.shift();
      if (buffer) {
        try {
          this.privSourceBuffer?.appendBuffer(buffer);
        } catch (error) {
          this.privBuffers.unshift(buffer);
        }
        this.endStream();
      }
    }
  }

  private endStream() {
    if (
      !this.privSourceBuffer?.updating &&
      this.privBuffers.length === 0 &&
      this.privStreamEnd
    ) {
      try {
        this.privMediaSource?.endOfStream();
      } catch (error) {}
    }
  }

  reset() {
    this.stop();
    this.privBuffers = [];
    this.privStreamEnd = false;
    this.privMediaSource = new MediaSource();
    this.privMediaSource.onsourceopen = () => {
      if (this.privMediaSource) {
        this.privSourceBuffer =
          this.privMediaSource.addSourceBuffer('audio/mpeg');
        this.privSourceBuffer.onupdate = () => {
          this.updateSourceBuffer();
          this.endStream();
        };
        this.privSourceBuffer.onupdateend = () => {
          this.updateSourceBuffer();
          this.endStream();
        };
      }
    };
    this.privMediaSource.onsourceclose = () => {};
    this.privAudio.src = URL.createObjectURL(this.privMediaSource);
  }

  setStreamEnd() {
    this.privStreamEnd = true;
    this.endStream();
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
