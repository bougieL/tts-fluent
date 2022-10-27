import path from 'path';

import { Router } from 'express';
import { ssmlToStream, textToSsml } from '@bougiel/tts-node';
import fs from 'fs-extra';
import md5 from 'md5';

import { PlayCache } from 'caches';

export function setupTextRouter(router: Router) {
  router.get('/', async (req, res) => {
    const { text, voice, style, rate, pitch, outputFormat } =
      req.query as Record<string, string>;
    if (!text) {
      res.sendStatus(400);
      return;
    }
    const ssml = textToSsml(text, {
      voice,
      style,
      rate,
      pitch,
    });
    const hash = md5(ssml);
    const cachePath = path.join(await PlayCache.getCachePath(), hash);
    const [isFinised, isExisted] = await Promise.all([
      PlayCache.getFinished(hash),
      fs.pathExists(cachePath),
    ]);
    if (isFinised && isExisted) {
      res.header('Content-Type', 'audio/mpeg');
      fs.createReadStream(cachePath).pipe(res);
      return;
    }

    function handleError(error: any) {
      const errorMessage = String(error);
      res.header('Content-Type', 'text/plain');
      if (errorMessage.includes('429')) {
        res
          .status(429)
          .send(
            'Reach api limit (200 query per 10 minutes), try change your ip or retry tommorrow'
          );
      } else {
        res.status(500).send(errorMessage);
      }
    }

    try {
      const stream = await ssmlToStream(ssml, outputFormat);
      res.header('Content-Type', 'audio/mpeg');
      stream
        .on('error', handleError)
        .on('end', () => {
          PlayCache.setFinished(hash);
        })
        .pipe(res);
      stream.pipe(fs.createWriteStream(cachePath));
    } catch (error) {
      handleError(error);
    }
  });
}
