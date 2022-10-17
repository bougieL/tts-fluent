import { Router } from 'express';
import { ssmlToStream, textToSsml } from '@bougiel/tts-node';

const router = Router();

router.get('/', async (req, res) => {
  // const text = req.query.text
  const { text } = req.query;
  if (!text) {
    res.send('Unknown text');
    return;
  }
  const stream = await ssmlToStream(textToSsml(text as string));
  res.header('Content-Type', 'audio/mpeg');
  stream.pipe(res);
});

export { router };
