import { ipcRenderer } from 'electron';
import { OpenSubWindow } from 'types';

import { IpcEvents } from 'const';

export const openSubWindow: OpenSubWindow = (path, options) => {
  ipcRenderer.invoke(
    IpcEvents.subWindowOpen,
    JSON.stringify({ path, options })
  );
};
