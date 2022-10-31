import { ipcMain } from 'electron';

import { IpcEvents } from 'const';
import { openSubWindow } from 'main/windows/openSubWindow';

ipcMain.handle(IpcEvents.subWindowOpen, (_, arg) => {
  const { path, options } = JSON.parse(arg);
  openSubWindow(path, options);
});
