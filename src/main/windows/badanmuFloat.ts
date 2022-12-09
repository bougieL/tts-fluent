import { BrowserWindow, screen } from 'electron';
import { IBadanmuSetting } from 'types';

import { resolveHtmlPath } from 'main/util';

import { getCommonOptions } from './common';

export async function openBadanmuFloatWindow<T extends IBadanmuSetting>(
  config: T
) {
  const url = `${resolveHtmlPath('index.html')}#/badanmu-float`;

  const display = screen.getPrimaryDisplay();

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
    x: display.workAreaSize.width - config.width,
    y: display.workAreaSize.height - config.height + 36,
  });

  floatWindow.setIgnoreMouseEvents(true);

  floatWindow.loadURL(url);

  floatWindow.on('ready-to-show', () => {
    floatWindow.show();
  });

  return floatWindow;
}
