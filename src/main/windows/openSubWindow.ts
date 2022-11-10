import { BrowserWindow } from 'electron';
import { SubWindowBaseOptions } from 'types';

import { IpcEvents } from 'const';
import { resolveHtmlPath } from 'main/util';

import { getCommonOptions } from './common';
import { getMainWindow, getSubWindowPosition } from './main';

const openedWindows = new Map<string, BrowserWindow>();

export async function openSubWindow<T extends SubWindowBaseOptions>(
  path: string,
  options?: T
) {
  const singleton = options?.singleton ?? true;
  const parent = options?.parent ?? (await getMainWindow());

  const url = `${resolveHtmlPath('index.html')}#${path}`;

  if (singleton && openedWindows.has(url)) {
    const subWindow = openedWindows.get(url)!;
    if (subWindow.isMinimized()) subWindow.restore();
    subWindow.show();
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
    parent,
    modal: options?.modal,
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
