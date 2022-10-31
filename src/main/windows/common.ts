import { getAssetPath } from 'main/util';

export const commonOptions: Electron.BrowserWindowConstructorOptions = {
  show: false,
  icon: getAssetPath('icon.png'),
  titleBarOverlay: {
    color: '#ffffff',
    height: 36,
  },
  titleBarStyle: 'hidden',
  frame: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    webSecurity: false,
  },
};
