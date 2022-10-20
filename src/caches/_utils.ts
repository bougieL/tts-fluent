import { IpcEvents } from 'const';
import { app, ipcMain, ipcRenderer } from 'electron';
import path from 'path';

export async function getCachesDir() {
  let userData = '';
  if (ipcMain) {
    userData = app.getPath('userData');
  } else {
    userData = await ipcRenderer.invoke(
      IpcEvents.electronAppGetPath,
      'userData'
    );
  }
  return path.join(userData, 'tts-fluent');
}

export async function getDownloadsDir() {
  let downloads = '';
  if (ipcMain) {
    downloads = app.getPath('downloads');
  } else {
    downloads = await ipcRenderer.invoke(
      IpcEvents.electronAppGetPath,
      'downloads'
    );
  }
  return downloads;
}
