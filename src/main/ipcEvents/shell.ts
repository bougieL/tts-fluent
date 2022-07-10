import { ipcMain, shell } from 'electron';

ipcMain.handle('electron.shell.showItemInFolder', (_, args) =>
  shell.showItemInFolder(args)
);
