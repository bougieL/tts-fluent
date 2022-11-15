/* eslint-disable no-underscore-dangle */
import stream from 'stream';

import { ipcRenderer, IpcRendererEvent } from 'electron';

export class EventStream extends stream.Readable {
  private removeSubscription?: () => void;

  constructor(channel: string) {
    super();

    const handler = (
      event: IpcRendererEvent,
      { chunk, isEnd, isError, errorMessage }: any
    ) => {
      if (isError) {
        this.destroy(new Error(errorMessage));
        return;
      }
      if (chunk) {
        this.push(chunk);
      }
      if (isEnd) {
        this.removeSubscription?.();
        this.push(null);
      }
    };
    ipcRenderer.on(channel, handler);
    this.removeSubscription = () => {
      ipcRenderer.off(channel, handler);
    };
  }

  _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void
  ): void {
    this.removeSubscription?.();
    callback(error);
  }

  // eslint-disable-next-line class-methods-use-this
  _read(size: number): void {}
}
