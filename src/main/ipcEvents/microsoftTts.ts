import { ssmlToBuffer } from '@bougiel/tts-node';
import { ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import * as uuid from 'uuid';
import { ConfigCache, HistoryCache } from '../caches';

ipcMain.handle('tts.microsoft.ssmlToBuffer', (_, text) => {
  return ssmlToBuffer(text);
});

ipcMain.handle('tts.microsoft.download', async (_, text) => {
  const buffer = await ssmlToBuffer(text);
  const downloadsDir = ConfigCache.getDownloadsDir();
  fs.ensureDirSync(downloadsDir);
  const now = Date.now();
  const p = path.join(downloadsDir, `${now}.mp3`);
  fs.createWriteStream(p, 'binary').write(buffer);
  HistoryCache.addItem({
    id: uuid.v4(),
    content: text,
    date: now,
    path: p,
  });
  return p;
});
