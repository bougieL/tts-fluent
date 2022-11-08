import { nativeTheme } from 'electron';

import { ConfigCache } from 'caches';
import { ThemeVariant } from 'const';
import { getAssetPath } from 'main/util';

export const lightColor = {
  backgroundColor: '#ffffff',
  symbolColor: '#1a1b1e',
};

export const darkColor = {
  backgroundColor: '#1a1b1e',
  symbolColor: '#ffffff',
};

export async function getCommonOptions() {
  const commonOptions = {
    show: false,
    icon: getAssetPath('icon.png'),
    titleBarOverlay: {
      color: lightColor.backgroundColor,
      symbolColor: lightColor.symbolColor,
      height: 36,
    },
    titleBarStyle: 'hidden',
    frame: false,
    backgroundColor: lightColor.backgroundColor,
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
    commonOptions.titleBarOverlay.color = darkColor.backgroundColor;
    commonOptions.titleBarOverlay.symbolColor = darkColor.symbolColor;
    commonOptions.backgroundColor = darkColor.backgroundColor;
  } else {
    commonOptions.titleBarOverlay.color = lightColor.backgroundColor;
    commonOptions.titleBarOverlay.symbolColor = lightColor.symbolColor;
    commonOptions.backgroundColor = lightColor.backgroundColor;
  }

  return commonOptions as Electron.BrowserWindowConstructorOptions;
}
