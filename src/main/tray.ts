import os from 'os';

import { app, Menu, Tray } from 'electron';

import { getAssetPath, resolveHtmlPath } from 'main/util';

import { getMainWindow } from './windows/main';

export function setupTray() {
  let icon = '';
  if (os.platform() === 'darwin') {
    icon = 'icons/tray.png';
  } else {
    icon = 'icons/tray.ico';
  }
  const tray = new Tray(getAssetPath(icon));

  async function openMainWindow(path: string) {
    const mainWindow = await getMainWindow();
    mainWindow.loadURL(`${resolveHtmlPath('index.html')}#${path}`);
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
  tray.on('click', () => {
    openMainWindow('/');
  });
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}
