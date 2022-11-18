import os from 'os';

import { app, Menu, Tray } from 'electron';

import { getAssetPath } from 'main/util';

import { openMainWindow } from './windows/main';

export function setupTray() {
  let icon = '';
  if (os.platform() === 'darwin') {
    icon = 'icons/tray.png';
  } else {
    icon = 'icons/tray.ico';
  }
  const tray = new Tray(getAssetPath(icon));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Microsoft TTS',
      type: 'normal',
      click: () => {
        openMainWindow({ path: '/', memo: true });
      },
    },
    {
      label: 'TTS Cat',
      type: 'normal',
      click: () => {
        openMainWindow({ path: '/ttsCat', memo: true });
      },
    },
    {
      label: 'Transfer',
      type: 'normal',
      click: () => {
        openMainWindow({ path: '/transfer', memo: true });
      },
    },
    {
      label: 'Downloads',
      type: 'normal',
      click: () => {
        openMainWindow({ path: '/downloads', memo: true });
      },
    },
    { label: 'Others', type: 'separator' },
    {
      label: 'Settings',
      type: 'normal',
      click: () => {
        openMainWindow({ path: '/settings', memo: true });
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
    openMainWindow();
  });
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu);
  });
}
