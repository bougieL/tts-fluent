import { dialog, ipcMain } from 'electron';

import { IpcEvents } from 'const';

ipcMain.handle(IpcEvents.electronDialogShowOpenDialog, (_, args) =>
  dialog.showOpenDialog(args)
);

ipcMain.handle(IpcEvents.electronDialogShowOpenDialogSync, (_, args) =>
  dialog.showOpenDialogSync(args)
);
