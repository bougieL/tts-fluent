/* eslint-disable no-underscore-dangle */
import stream from 'stream';

import { AudioStatus, StatusChangeCallback } from './types';

// https://nodejs.org/api/stream.html#an-example-writable-stream
export class StreamAudio extends stream.Writable {
  private privAudio = new Audio();

  private privStatus = AudioStatus.empty;

  private privBuffers: ArrayBuffer[] = [];

  private privStatusChangeCallbacks = new Set<StatusChangeCallback>();

  private privMediaSource?: MediaSource;

  private privSourceBuffer?: SourceBuffer;

  private privStreamEnd = false;

  constructor() {
    super();
    this.reset();
    this.setupAudioListener();
  }

  private appendBuffer(buffer: ArrayBuffer) {
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

  private setStreamEnd() {
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

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    // console.log('_write', chunk)
    this.appendBuffer(chunk);
    callback();
  }

  _final(callback: (error?: Error | null | undefined) => void): void {
    this.setStreamEnd();
    callback();
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void
  ): void {
    this.setStreamEnd();
    callback(error);
  }
}
