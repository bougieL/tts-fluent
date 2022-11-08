import { nativeTheme } from 'electron';

import { ConfigCache } from 'caches';
import { ThemeVariant } from 'const';
import { getAssetPath } from 'main/util';

export async function getCommonOptions() {
  const commonOptions = {
    show: false,
    icon: getAssetPath('icon.png'),
    titleBarOverlay: {
      color: '#ffffff',
      symbolColor: '#1a1b1e',
      height: 36,
    },
    titleBarStyle: 'hidden',
    frame: false,
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  };

  const theme = await ConfigCache.getTheme();

  if (
    (theme === ThemeVariant.system && nativeTheme.shouldUseDarkColors) ||
    theme === ThemeVariant.dark
  ) {
    commonOptions.titleBarOverlay.color = '#1a1b1e';
    commonOptions.titleBarOverlay.symbolColor = '#ffffff';
    commonOptions.backgroundColor = '#1a1b1e';
  } else {
    commonOptions.titleBarOverlay.color = '#ffffff';
    commonOptions.titleBarOverlay.symbolColor = '#1a1b1e';
    commonOptions.backgroundColor = '#ffffff';
  }

  return commonOptions as Electron.BrowserWindowConstructorOptions;
}
