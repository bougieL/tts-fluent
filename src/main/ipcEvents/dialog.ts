import { IpcEvents } from 'const';
import { dialog, ipcMain } from 'electron';

ipcMain.handle(IpcEvents.electronDialogShowOpenDialog, (_, args) =>
  dialog.showOpenDialog(args)
);

ipcMain.handle(IpcEvents.electronDialogShowOpenDialogSync, (_, args) =>
  dialog.showOpenDialogSync(args)
);
