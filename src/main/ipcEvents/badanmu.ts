import { BrowserWindow, ipcMain } from 'electron';
import { IBadanmuSetting } from 'types';

import { IpcEvents } from 'const';
import { openBadanmuFloatWindow } from 'main/windows';

let floatWindow: BrowserWindow | null = null;

ipcMain.handle(
  IpcEvents.badanmuFloatWindow,
  async (_, config: IBadanmuSetting) => {
    if (config.floatWindow) {
      if (floatWindow) {
      } else {
        floatWindow = await openBadanmuFloatWindow(config);

        floatWindow.on('close', () => {
          floatWindow = null;
        });
      }
    } else if (floatWindow) {
      floatWindow.close();
      floatWindow = null;
    }
  }
);
