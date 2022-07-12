import { app, ipcMain, ipcRenderer } from 'electron';
import path from 'path';

export async function getCachesDir() {
  let userData = '';
  if (ipcMain) {
    userData = app.getPath('userData');
  } else {
    userData = await ipcRenderer.invoke('electron.app.getPath', 'userData');
  }
  return path.join(userData, 'tts-fluent');
}
