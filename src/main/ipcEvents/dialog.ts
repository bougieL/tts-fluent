import { dialog, ipcMain } from 'electron';

ipcMain.handle('electron.dialog.showOpenDialog', (_, args) =>
  dialog.showOpenDialog(args)
);

ipcMain.handle('electron.dialog.showOpenDialogSync', (_, args) =>
  dialog.showOpenDialogSync(args)
);
