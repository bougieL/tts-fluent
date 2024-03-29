import { BrowserWindow, ipcMain, nativeTheme } from 'electron';

import { ConfigCache } from 'caches';
import { IpcEvents } from 'const';
import { darkColor, lightColor } from 'main/windows/common';
import { openSubWindow } from 'main/windows/openSubWindow';

ipcMain.handle(IpcEvents.subWindowOpen, (_, arg) => {
  const { path, options } = JSON.parse(arg);
  openSubWindow(path, options);
});

ipcMain.on(IpcEvents.themeChange, (_, arg) => {
  ConfigCache.write(ConfigCache.Key.theme, arg);
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
  const color = dark ? darkColor.backgroundColor : lightColor.backgroundColor;
  const symbolColor = dark ? darkColor.symbolColor : lightColor.symbolColor;
  windows.forEach((win) => {
    win.setBackgroundColor(color);
    win.setTitleBarOverlay?.({
      color,
      symbolColor,
    });
  });
}

nativeTheme.on('updated', updateThemeColor);
