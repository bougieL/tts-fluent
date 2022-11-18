import { app, BrowserWindow } from 'electron';

import { ConfigCache } from 'caches';
import { isProd } from 'lib/env';
import { resolveHtmlPath } from 'main/util';

import { getCommonOptions } from './common';

let mainWindow: BrowserWindow | null;

export async function createMainWindow() {
  const commonOptions = await getCommonOptions();

  mainWindow = new BrowserWindow({
    show: true,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    ...commonOptions,
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    openMainWindow();
  });
  // Create myWindow, load the rest of the app, etc...
  app.on('ready', () => {});
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

export async function getMainWindow(
  createIfNonExists: false
): Promise<BrowserWindow | null>;
export async function getMainWindow(
  createIfNonExists?: true
): Promise<BrowserWindow>;
export async function getMainWindow(createIfNonExists = true) {
  if (createIfNonExists && mainWindow === null) {
    return createMainWindow();
  }
  return mainWindow;
}

export async function openMainWindow(options?: {
  path?: string;
  memo?: boolean;
}) {
  const path = options?.path || (await ConfigCache.getRoute());
  const memo = options?.memo;
  const mainWindow = await getMainWindow();
  const currentURL = mainWindow.webContents.getURL();
  const newURL = `${resolveHtmlPath('index.html')}#${path}`;
  if (newURL !== currentURL) {
    mainWindow.loadURL(newURL);
  }
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  mainWindow.show();
  mainWindow.focus();
  if (memo) {
    ConfigCache.write(ConfigCache.Key.route, path);
  }
}
