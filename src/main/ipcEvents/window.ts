import os from 'os';

import { BrowserWindow, ipcMain, nativeTheme } from 'electron';

import { ConfigCache } from 'caches';
import { IpcEvents } from 'const';
import { openSubWindow } from 'main/windows/openSubWindow';

ipcMain.handle(IpcEvents.subWindowOpen, (_, arg) => {
  const { path, options } = JSON.parse(arg);
  openSubWindow(path, options);
});

ipcMain.on(IpcEvents.themeChange, (_, arg) => {
  ConfigCache.writeConfig(ConfigCache.ConfigKey.theme, arg);
  nativeTheme.themeSource = arg;
});

function updateThemeColor() {
  let dark = false;
  if (nativeTheme.themeSource === 'system') {
    dark = nativeTheme.shouldUseDarkColors;
  }
  if (nativeTheme.themeSource === 'dark') {
    dark = true;
  }
  if (nativeTheme.themeSource === 'light') {
    dark = false;
  }
  const windows = BrowserWindow.getAllWindows();
  const color = dark ? '#1a1b1e' : '#ffffff';
  const symbolColor = dark ? '#ffffff' : '#1a1b1e';
  windows.forEach((win) => {
    win.setBackgroundColor(color);
    if (os.platform() === 'win32') {
      win.setTitleBarOverlay({
        color,
        symbolColor,
      });
    }
  });
}

nativeTheme.on('updated', updateThemeColor);
