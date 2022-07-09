import { app, ipcMain } from 'electron';

ipcMain.handle('electron.app.getPath', (_, args) => app.getPath(args));
