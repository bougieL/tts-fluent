import { ssmlToBuffer, ssmlToStream } from '@bougiel/tts-node';
import { ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import * as uuid from 'uuid';
import { ConfigCache, HistoryCache } from '../../caches';

ipcMain.handle('tts.microsoft.ssmlToBuffer', (_, text) => {
  return ssmlToBuffer(text);
});

ipcMain.handle('tts.microsoft.download', async (_, text) => {
  const stream = await ssmlToStream(text);
  const downloadsDir = await ConfigCache.getDownloadsDir();
  fs.ensureDirSync(downloadsDir);
  const now = Date.now();
  const downloadFilePath = path.join(downloadsDir, `${now}.download`);
  const destFilePath = path.join(downloadsDir, `${now}.mp3`);
  const writeStream = fs.createWriteStream(downloadFilePath);
  stream.pipe(writeStream);
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      fs.rename(downloadFilePath, destFilePath);
      HistoryCache.addItem({
        id: uuid.v4(),
        content: text,
        date: now,
        path: destFilePath,
      });
      resolve(destFilePath);
    });
    writeStream.on('error', reject);
  });
});
