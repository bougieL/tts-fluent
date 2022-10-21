import { BrowserWindow } from 'electron';

export function setupWindowOpenHandler(mainWindow: BrowserWindow) {
  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((data) => {
    // const { url } = data;
    console.log(data);
    // shell.openExternal(edata.url);
    // if (url === WindowType.markdown) {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        // frame: false,
        // fullscreenable: false,
        // width: 1000,
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
      },
    };
    // }
    // return { action: 'deny' };
  });
}
