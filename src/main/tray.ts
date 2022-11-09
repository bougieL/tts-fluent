import os from 'os';

import { app, BrowserWindow, Menu, Tray } from 'electron';

import { getAssetPath, resolveHtmlPath } from 'main/util';

export function setupTray(params: { getMainWindow(): Promise<BrowserWindow> }) {
  const { getMainWindow } = params;
  let icon = '';
  if (os.platform() === 'darwin') {
    icon = 'icons/tray.png';
  } else {
    icon = 'icons/tray.ico';
  }
  const tray = new Tray(getAssetPath(icon));

  async function openMainWindow(path: string) {
    const mainWindow = await getMainWindow();
    mainWindow.loadURL(`${resolveHtmlPath('index.html')}/#${path}`);
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Microsoft TTS',
      type: 'normal',
      click: () => {
        openMainWindow('/');
      },
    },
    {
      label: 'TTS Cat',
      type: 'normal',
      click: () => {
        openMainWindow('/ttsCat');
      },
    },
    {
      label: 'Transfer',
      type: 'normal',
      click: () => {
        openMainWindow('/transfer');
      },
    },
    {
      label: 'Downloads',
      type: 'normal',
      click: () => {
        openMainWindow('/downloads');
      },
    },
    { label: 'Others', type: 'separator' },
    {
      label: 'Settings',
      type: 'normal',
      click: () => {
        openMainWindow('/settings');
      },
    },
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('TTS Fluent');
  tray.setIgnoreDoubleClickEvents(true);
  tray.on('click', async () => {
    const mainWindow = await getMainWindow();
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
  });
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}
