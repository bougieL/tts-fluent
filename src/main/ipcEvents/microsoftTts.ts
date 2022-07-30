import { ssmlToStream } from '@bougiel/tts-node';
import { app, ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import * as uuid from 'uuid';
import md5 from 'md5';
import { ErrorMessage, IpcEvents } from 'const';
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

ipcMain.handle(
  IpcEvents.ttsMicrosoftPlayStream,
  async (event, { ssml, sessionId }) => {
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
    writeStream.on('finish', () => {
      PlayCache.setFinished(hash);
    });
    stream.on('data', (chunk) => {
      event.sender.send(IpcEvents.ttsMicrosoftPlayStream, { chunk, sessionId });
    });
    stream.on('close', () => {
      event.sender.send(IpcEvents.ttsMicrosoftPlayStream, {
        sessionId,
        isEnd: true,
      });
    });
    stream.on('error', () => {
      event.sender.send(IpcEvents.ttsMicrosoftPlayStream, {
        sessionId,
        isError: true,
      });
    });
    return null;
  }
);

const streamMap: Record<string, fs.WriteStream> = {};

ipcMain.handle(
  IpcEvents.ttsMicrosoftDownload,
  async (event, { ssml, id: originId }) => {
    const downloadsDir = await ConfigCache.getTTSDownloadsDir();
    const hash = md5(ssml);
    const now = Date.now();
    const id = originId || uuid.v4();
    const destFilePath = path.join(downloadsDir, `${hash}.mp3`);
    const exists = await fs.pathExists(destFilePath);
    const downloadRecord = await DownloadsCache.getItemByHash(hash);
    if (exists && downloadRecord?.status === DownloadsCache.Status.finished) {
      await DownloadsCache.updateItem(id, { date: now });
      return destFilePath;
    }
    await fs.remove(destFilePath);
    await fs.ensureFile(destFilePath);
    const stream = await ssmlToStream(ssml);
    const writeStream = fs.createWriteStream(destFilePath);
    streamMap[id] = writeStream;
    await DownloadsCache.addItem({
      id,
      content: ssml,
      md5: hash,
      date: now,
      path: destFilePath,
      status: DownloadsCache.Status.downloading,
    });
    stream.pipe(writeStream);
    writeStream.on('finish', async () => {
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
      if (error.message === ErrorMessage.abort) {
        return;
      }
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
  }
);

ipcMain.handle(IpcEvents.ttsMidrosoftDownloadRemove, (_, id) => {
  streamMap[id]?.destroy(new Error(ErrorMessage.abort));
  DownloadsCache.removeItem(id);
});

app.on('ready', async () => {
  const list = await DownloadsCache.getList();
  const batches = list
    .filter((item) => item.status === DownloadsCache.Status.downloading)
    .map((item) => {
      return {
        id: item.id,
        data: { status: DownloadsCache.Status.error },
      };
    });
  DownloadsCache.updateBatches(batches);
});
