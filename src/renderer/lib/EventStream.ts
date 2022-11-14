/* eslint-disable no-underscore-dangle */
import stream from 'stream';

import { ipcRenderer, IpcRendererEvent } from 'electron';

export class EventStream extends stream.Readable {
  private channel: string;

  private removeSubscription?: () => void;

  constructor(channel: string) {
    super();
    this.channel = channel;
  }

  _construct(callback: (error?: Error | null | undefined) => void): void {
    const handler = (
      event: IpcRendererEvent,
      { chunk, isEnd, isError, errorMessage }: any
    ) => {
      if (isError) {
        callback(new Error(errorMessage));
        return;
      }
      if (chunk) {
        this.push(chunk);
      }
      if (isEnd) {
        this.removeSubscription?.();
        this.push(null);
      }
      callback();
    };
    ipcRenderer.on(this.channel, handler);

    this.removeSubscription = () => {
      ipcRenderer.off(this.channel, handler);
    };
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void
  ): void {
    this.removeSubscription?.();
    callback(error);
  }
}
