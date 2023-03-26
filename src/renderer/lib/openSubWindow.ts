import { ipcRenderer } from 'electron';
import { SubWindowBaseOptions } from 'types';

import { IpcEvents } from 'const';

export const openSubWindow = <T extends SubWindowBaseOptions>(
  path: string,
  options?: T
) => {
  ipcRenderer.invoke(
    IpcEvents.subWindowOpen,
    JSON.stringify({ path, options })
  );
};
