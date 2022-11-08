import { BrowserWindow } from 'electron';

import { resolveHtmlPath } from 'main/util';

import { getCommonOptions } from './common';

let mainWindow: BrowserWindow | null;

export async function createMainWindow() {
  const commonOptions = await getCommonOptions();

  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    ...commonOptions,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  return mainWindow;
}

export function getSubWindowPosition() {
  if (!mainWindow) {
    return {
      x: undefined,
      y: undefined,
    };
  }
  const [currentWindowX, currentWindowY] = mainWindow.getPosition();

  return {
    x: currentWindowX + 36,
    y: currentWindowY + 36,
  };
}
