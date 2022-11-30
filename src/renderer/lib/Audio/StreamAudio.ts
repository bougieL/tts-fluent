/* eslint-disable no-underscore-dangle */
import stream from 'stream';

import { AudioStatus, StatusChangeCallback } from './types';

// https://nodejs.org/api/stream.html#an-example-writable-stream
export class StreamAudio extends stream.Writable {
  private privStatus = AudioStatus.empty;

  private privBuffers: ArrayBuffer[] = [];

  private privStatusChangeCallbacks = new Set<StatusChangeCallback>();

  private privMediaSource = new MediaSource();

  private privAudio = new Audio(URL.createObjectURL(this.privMediaSource));

  private privSourceBuffer?: SourceBuffer;

  private privStreamEnd = false;

  constructor() {
    super();

    // this.privMediaSource.onsourceclose = () => {};
    this.privMediaSource.onsourceopen = () => {
      this.privSourceBuffer =
        this.privMediaSource.addSourceBuffer('audio/mpeg');
      // this.privSourceBuffer.onupdate = () => {
      //   this.updateSourceBuffer();
      //   this.tryEndStream();
      // };
      this.privSourceBuffer.onupdateend = () => {
        this.updateSourceBuffer();
        this.tryEndStream();
      };
    };

    this.setupAudioListener();
  }

  set status(value: AudioStatus) {
    this.privStatus = value;
    this.privStatusChangeCallbacks.forEach((item) => item(value));
  }

  get status() {
    return this.privStatus;
  }

  private appendBuffer(buffer: ArrayBuffer) {
    this.privBuffers.push(buffer);
    this.updateSourceBuffer();
  }

  private setupAudioListener() {
    const handleEnded = () => {
      this.status = AudioStatus.stopped;
    };
    const handleError = (error: ErrorEvent) => {
      console.error(error);
      this.status = AudioStatus.error;
    };
    this.privAudio.addEventListener('ended', handleEnded);
    this.privAudio.addEventListener('error', handleError);

    return {
      remove: () => {
        this.privAudio.removeEventListener('ended', handleEnded);
        this.privAudio.removeEventListener('error', handleError);
      },
    };
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
          console.error(error);
          this.privBuffers.unshift(buffer);
        }
        this.tryEndStream();
      }
    }
  }

  private setStreamEnd() {
    this.privStreamEnd = true;
    this.tryEndStream();
  }

  private tryEndStream() {
    if (
      !this.privSourceBuffer?.updating &&
      this.privBuffers.length === 0 &&
      this.privStreamEnd &&
      this.privMediaSource.readyState === 'open'
    ) {
      try {
        this.privMediaSource.endOfStream();
      } catch (error) {
        console.error(error);
      }
    }
  }

  play() {
    this.status = AudioStatus.playing;
    return this.privAudio.play();
  }

  pause() {
    this.status = AudioStatus.paused;
    this.privAudio.pause();
  }

  stop() {
    this.status = AudioStatus.stopped;
    this.privAudio.pause();
    this.privAudio.currentTime = 0;
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
    this.appendBuffer(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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
