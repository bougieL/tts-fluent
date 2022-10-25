import path from 'path';

import { Router } from 'express';
import { escapeText, ssmlToStream } from '@bougiel/tts-node';
import axios from 'axios';
import fs from 'fs-extra';
import md5 from 'md5';

import { PlayCache } from 'caches';

export function setupQykRouter(router: Router) {
  router.get('/qyk', async (req, res) => {
    const { text, outputFormat } = req.query as Record<string, string>;
    if (!text) {
      res.sendStatus(400);
      return;
    }
    const feifei = await getQyk(text.slice(text.indexOf('：') + 1));
    const ssml = text2ssml(text, feifei);
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
      if (error.includes('429')) {
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

function text2ssml(a: string, b: string) {
  const feifei = b
    ? `<voice name="zh-CN-XiaoyouNeural">
  <break time="500ms" />
  ${escapeText(b)}
</voice>`
    : '';
  return `<speak xmlns="http://www.w3.org/2001/10/synthesis"
  xmlns:mstts="http://www.w3.org/2001/mstts"
  xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="zh-CN">
  <voice name="zh-CN-YunxiNeural">
    ${escapeText(a)}
  </voice>
  ${feifei}
</speak>`;
}

async function getQyk(text: string) {
  try {
    const {
      data: { content, result },
    } = await axios.get('http://api.qingyunke.com/api.php', {
      params: {
        key: 'free',
        appid: 0,
        msg: text,
      },
    });
    if (result === 0) {
      return `菲菲说：${content}`;
    }
    return '';
  } catch (error) {
    return '';
  }
}
