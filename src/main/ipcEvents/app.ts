import { app, ipcMain, nativeTheme } from 'electron';

import { ConfigCache } from 'caches';
import { IpcEvents } from 'const';

ipcMain.handle(IpcEvents.electronAppGetPath, (_, args) => app.getPath(args));

ipcMain.handle(IpcEvents.electronAppGetVersion, () => app.getVersion());

ipcMain.on(IpcEvents.themeChange, (_, arg) => {
  ConfigCache.writeConfig(ConfigCache.ConfigKey.theme, arg);
  nativeTheme.themeSource = arg;
});
