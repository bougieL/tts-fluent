import { ssmlToStream } from '@bougiel/tts-node';
import { ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import * as uuid from 'uuid';
import md5 from 'md5';
import { IpcEvents } from 'const';
import { ConfigCache, DownloadsCache, PlayCache } from 'caches';

ipcMain.handle(IpcEvents.ttsMicrosoftPlay, async (_, ssml) => {
  const hash = md5(ssml);
  const playCachesDir = await PlayCache.getCachePath();
  const destFilePath = path.join(playCachesDir, `${hash}`);
  const isFinised = await PlayCache.getFinished(hash);
  const exists = await fs.pathExists(destFilePath);
  if (isFinised && exists) {
    return destFilePath;
  }
  const stream = await ssmlToStream(ssml);
  await fs.ensureFile(destFilePath);
  const writeStream = fs.createWriteStream(destFilePath);
  stream.pipe(writeStream);
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      PlayCache.setFinished(hash);
      resolve(destFilePath);
    });
    writeStream.on('error', reject);
  });
});

ipcMain.handle(IpcEvents.ttsMicrosoftDownload, async (event, ssml) => {
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
  await DownloadsCache.addItem({
    id,
    content: ssml,
    md5: hash,
    date: now,
    path: downloadFilePath,
    status: DownloadsCache.Status.downloading,
  });
  stream.pipe(writeStream);
  writeStream.on('finish', async () => {
    await fs.rename(downloadFilePath, destFilePath).catch((error) => {
      const errorMessage = JSON.stringify(error);
      DownloadsCache.updateItem(id, {
        status: DownloadsCache.Status.error,
        errorMessage,
      });
      event.sender.send(IpcEvents.ttsMicrosoftDownloadStatusChange, {
        status: DownloadsCache.Status.error,
        payload: `${destFilePath} ${errorMessage}`,
      });
    });
    DownloadsCache.updateItem(id, {
      path: destFilePath,
      status: DownloadsCache.Status.finished,
    });
    event.sender.send(IpcEvents.ttsMicrosoftDownloadStatusChange, {
      status: DownloadsCache.Status.finished,
      payload: destFilePath,
    });
  });
  writeStream.on('error', (error) => {
    DownloadsCache.updateItem(id, {
      status: DownloadsCache.Status.error,
      errorMessage: error.message,
    });
    event.sender.send(IpcEvents.ttsMicrosoftDownloadStatusChange, {
      status: DownloadsCache.Status.error,
      payload: `${destFilePath} ${error.message}`,
    });
  });
  return destFilePath;
});
