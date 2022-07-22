import { IpcEvents } from 'const';
import { app, ipcMain } from 'electron';

ipcMain.handle(IpcEvents.electronAppGetPath, (_, args) => app.getPath(args));

ipcMain.handle(IpcEvents.electronAppGetVersion, () => app.getVersion());
