import { BrowserWindow } from 'electron';
import { IBadanmuSetting } from 'types';

import { resolveHtmlPath } from 'main/util';

import { getCommonOptions } from './common';

export async function openBadanmuFloatWindow<T extends IBadanmuSetting>(
  config: T
) {
  const url = `${resolveHtmlPath('index.html')}#/badanmu-float`;

  const commonOptions = await getCommonOptions();

  const floatWindow = new BrowserWindow({
    show: false,
    width: config.width,
    height: config.height,
    minimizable: false,
    maximizable: false,
    ...commonOptions,
    transparent: true,
    backgroundColor: undefined,
    titleBarOverlay: false,
    frame: false,
    hasShadow: false,
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
    x: config.left,
    y: config.top,
    skipTaskbar: true,
  });

  floatWindow.setIgnoreMouseEvents(true);

  floatWindow.loadURL(url);

  floatWindow.on('ready-to-show', () => {
    floatWindow.show();
  });

  return floatWindow;
}
