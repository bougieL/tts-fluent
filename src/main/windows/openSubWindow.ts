import { BrowserWindow } from 'electron';
import { SubWindowBaseOptions } from 'types';

import { IpcEvents } from 'const';
import { resolveHtmlPath } from 'main/util';

import { getCommonOptions } from './common';
import { getSubWindowPosition } from './main';

const openedWindows = new Map<string, BrowserWindow>();

export async function openSubWindow<T extends SubWindowBaseOptions>(
  path: string,
  options?: T
) {
  const singleton = options?.singleton ?? true;

  const url = `${resolveHtmlPath('index.html')}#${path}`;

  if (singleton && openedWindows.has(url)) {
    const subWindow = openedWindows.get(url)!;
    if (subWindow.isMinimized()) subWindow.restore();
    subWindow.focus();
    return subWindow;
  }

  const commonOptions = await getCommonOptions();

  const subWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    ...getSubWindowPosition(),
    ...commonOptions,
  });

  subWindow.loadURL(url);

  openedWindows.set(url, subWindow);

  subWindow.on('ready-to-show', () => {
    subWindow.show();
    subWindow.webContents.send(IpcEvents.subWindowInitialData, options);
  });

  subWindow.on('close', () => {
    openedWindows.delete(url);
  });

  return subWindow;
}
