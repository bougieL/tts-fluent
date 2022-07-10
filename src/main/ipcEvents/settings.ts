import { app, ipcMain } from 'electron';
import { ConfigCache } from '../caches';

ipcMain.handle('settings.downloadsDirectory.get', () =>
  // dialog.showOpenDialogSync(args)
  ConfigCache.getDownloadsDir()
);

ipcMain.handle('settings.downloadsDirectory.set', (_, args) =>
  ConfigCache.writeConfig(ConfigCache.ConfigKey.downloadsDir, args)
);
