import path from 'path';

import { Router } from 'express';
import { escapeText, ssmlToStream } from '@bougiel/tts-node';
import axios from 'axios';
import fs from 'fs-extra';
import md5 from 'md5';

import { PlayCache } from 'caches';

export function setupAiChatRouter(router: Router) {
  router.get('/aiChat', async (req, res) => {
    const {
      text,
      voiceA = 'zh-CN-XiaoshuangNeural',
      voiceB = 'zh-CN-XiaoxiaoNeural',
      outputFormat,
    } = req.query as Record<string, string>;
    if (!text) {
      res.sendStatus(400);
      return;
    }
    const danmuPosition = text.indexOf('说:');
    const danmu = text.slice(danmuPosition + 2).trim();
    const feifei = danmuPosition > -1 ? await getQyk(danmu) : '';
    const ssml = text2ssml(
      { text, voice: voiceA },
      { text: feifei, voice: voiceB }
    );
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

interface IVoiceItem {
  text: string;
  voice: string;
}

function text2ssml(a: IVoiceItem, b: IVoiceItem) {
  const feifei = b
    ? `<voice name="${b.voice}">
  <break time="500ms" />
  ${escapeText(b.text)}
</voice>`
    : '';
  return `<speak xmlns="http://www.w3.org/2001/10/synthesis"
  xmlns:mstts="http://www.w3.org/2001/mstts"
  xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="zh-CN">
  <voice name="${a.voice}">
    ${escapeText(a.text)}
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
