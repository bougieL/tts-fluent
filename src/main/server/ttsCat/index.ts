import path from 'path';

import { Router } from 'express';
import { ssmlToStream, textToSsml } from '@bougiel/tts-node';
import fs from 'fs-extra';
import md5 from 'md5';

import { PlayCache } from 'caches';

const router = Router();

router.get('/', async (req, res) => {
  const { text, voice, style, rate, pitch, outputFormat } = req.query as Record<
    string,
    string
  >;
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

  try {
    const stream = await ssmlToStream(ssml, outputFormat);
    res.header('Content-Type', 'audio/mpeg');
    stream
      .on('error', (error) => {
        res
          .header('Content-Type', 'text/plain')
          .status(500)
          .send(error.message);
      })
      .on('end', () => {
        PlayCache.setFinished(hash);
      })
      .pipe(res);
    stream.pipe(fs.createWriteStream(cachePath));
  } catch (error) {
    if (String(error).includes('429')) {
      res
        .header('Content-Type', 'text/plain')
        .status(429)
        .send('Reach api limit, try change your ip or retry tommorrow');
      return;
    }
    res.header('Content-Type', 'text/plain').status(500).send(String(error));
  }
});

export { router };
