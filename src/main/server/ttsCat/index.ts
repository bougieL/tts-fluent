import { Router } from 'express';
import { ssmlToStream, textToSsml } from '@bougiel/tts-node';

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
  const stream = await ssmlToStream(
    textToSsml(text, {
      voice,
      style,
      rate,
      pitch,
    }),
    outputFormat
  ).catch((error) => {
    if (String(error).includes('429')) {
      res
        .status(429)
        .send('Reach api limit, try change your ip or retry tommorrow');
      return;
    }
    res.sendStatus(500);
  });
  res.header('Content-Type', 'audio/mpeg');
  stream?.pipe(res);
  stream?.on('error', (error) => {
    res.status(500).send(error.message);
  });
});

export { router };
