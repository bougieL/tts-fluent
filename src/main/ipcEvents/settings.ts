import { app, ipcMain } from 'electron';
import { ConfigKey, getConfig, getDownloadsDir, writeConfig } from '../caches';

ipcMain.handle('settings.downloadsDirectory.get', () =>
  // dialog.showOpenDialogSync(args)
  getDownloadsDir()
);

ipcMain.handle('settings.downloadsDirectory.set', (_, args) =>
  writeConfig(ConfigKey.downloadsDir, args)
);
