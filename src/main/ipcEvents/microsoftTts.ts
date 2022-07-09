import { ssmlToBuffer } from '@bougiel/tts-node';
import { ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { getDownloadsDir } from '../caches';

ipcMain.handle('tts.microsoft.ssmlToBuffer', (_, text) => {
  return ssmlToBuffer(text);
});

ipcMain.handle('tts.microsoft.download', async (_, text) => {
  const buffer = await ssmlToBuffer(text);
  const downloadsDir = getDownloadsDir();
  fs.ensureDirSync(downloadsDir);
  const p = path.join(downloadsDir, `${Date.now()}.mp3`);
  fs.createWriteStream(p, 'binary').write(buffer);
  return p;
});
