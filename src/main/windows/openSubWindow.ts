import { BrowserWindow } from 'electron';
import { OpenSubWindow } from 'types';

import { IpcEvents } from 'const';
import { resolveHtmlPath } from 'main/util';

import { commonOptions } from './common';
import { getSubWindowPosition } from './main';

export const openSubWindow: OpenSubWindow = (path, options) => {
  const subWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    ...getSubWindowPosition(),
    ...commonOptions,
  });

  subWindow.loadURL(`${resolveHtmlPath('index.html')}#${path}`);

  subWindow.on('ready-to-show', () => {
    subWindow.show();
    subWindow.webContents.send(IpcEvents.subWindowInitialData, options);
  });

  return subWindow;
};
