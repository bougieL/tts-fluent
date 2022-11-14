/* eslint-disable no-underscore-dangle */
import stream from 'stream';

import { BufferAudio } from './BufferAudio';

export class StreamAudio extends stream.Writable {
  audio: BufferAudio;

  constructor() {
    super();
    this.audio = new BufferAudio();
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    this.audio.appendBuffer(chunk);
  }

  _final(callback: (error?: Error | null | undefined) => void): void {
    this.audio.setStreamEnd();
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void
  ): void {
    this.audio.setStreamEnd();
    callback(error);
  }
}
