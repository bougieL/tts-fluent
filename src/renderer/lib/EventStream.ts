/* eslint-disable no-underscore-dangle */
import stream from 'stream';

import { ipcRenderer, IpcRendererEvent } from 'electron';

function throwIfError(error: any) {
  if (error) {
    throw error;
  }
}

export class EventStream extends stream.Duplex {
  private channel: string;

  constructor(channel: string) {
    super();
    this.channel = channel;
    ipcRenderer.on(channel, this.streamHandler);
  }

  private streamHandler = (
    event: IpcRendererEvent,
    { chunk, isEnd, isError, errorMessage }: any
  ) => {
    if (chunk) {
      this._write(chunk, 'utf-8', throwIfError);
    }
    if (isEnd || isError) {
      ipcRenderer.off(this.channel, this.streamHandler);
      this._final(throwIfError);
    }
    if (isError && errorMessage) {
      this._destroy(new Error(errorMessage), throwIfError);
    }
  };
}
