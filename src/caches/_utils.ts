import { app, ipcMain, ipcRenderer } from 'electron';
import path from 'path';
import { IpcEvents } from 'const';

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
