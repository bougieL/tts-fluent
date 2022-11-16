import { app, BrowserWindow } from 'electron';

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

// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', (event, commandLine, workingDirectory) => {
//     // Someone tried to run a second instance, we should focus our window.
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       mainWindow.focus();
//     }
//   });

//   // Create myWindow, load the rest of the app, etc...
//   app.on('ready', () => {});
// }

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
