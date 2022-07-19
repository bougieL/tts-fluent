import { ssmlToStream } from '@bougiel/tts-node';
import { ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import * as uuid from 'uuid';
import md5 from 'md5';
import { ConfigCache, DownloadsCache, PlayCache } from '../../caches';

ipcMain.handle('tts.microsoft.play', async (_, ssml) => {
  const hash = md5(ssml);
  const playCachesDir = await PlayCache.getCachePath();
  const destFilePath = path.join(playCachesDir, `${hash}`);
  const isFinised = await PlayCache.getFinished(hash);
  const exists = await fs.pathExists(destFilePath);
  if (isFinised && exists) {
    return { src: destFilePath, hash };
  }
  const stream = await ssmlToStream(ssml);
  await fs.ensureFile(destFilePath);
  const writeStream = fs.createWriteStream(destFilePath);
  stream.pipe(writeStream);
  writeStream.on('finish', () => {
    PlayCache.setFinished(hash);
  });
  return { src: destFilePath, hash };
});

ipcMain.handle('tts.microsoft.download', async (_, ssml) => {
  const downloadsDir = await ConfigCache.getDownloadsDir();
  const hash = md5(ssml);
  const downloadFilePath = path.join(downloadsDir, `${hash}.download`);
  const destFilePath = path.join(downloadsDir, `${hash}.mp3`);
  if (await fs.pathExists(destFilePath)) {
    return destFilePath;
  }
  const stream = await ssmlToStream(ssml);
  await fs.ensureDir(downloadsDir);
  const now = Date.now();
  const writeStream = fs.createWriteStream(downloadFilePath);
  const id = uuid.v4();
  DownloadsCache.addItem(
    {
      id,
      content: ssml,
      md5: hash,
      date: now,
      path: downloadFilePath,
      downloading: true,
    },
    writeStream
  );
  stream.pipe(writeStream);
  return new Promise((resolve, reject) => {
    writeStream.on('finish', async () => {
      await DownloadsCache.removeItem(id);
      await fs.rename(downloadFilePath, destFilePath).catch(reject);
      DownloadsCache.addItem({
        id,
        content: ssml,
        date: now,
        md5: hash,
        path: destFilePath,
        downloading: false,
      });
      resolve(destFilePath);
    });
    writeStream.on('error', reject);
  });
});
