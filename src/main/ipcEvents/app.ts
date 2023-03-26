import { app, ipcMain } from 'electron';

import { IpcEvents } from 'const';

ipcMain.handle(IpcEvents.electronAppGetPath, (_, args) => app.getPath(args));

ipcMain.handle(IpcEvents.electronAppGetVersion, () => app.getVersion());
