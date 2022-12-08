import path from 'path';

import express from 'express';

import { getAssetPath } from 'main/util';

export const router = express.Router();

const staticPath = getAssetPath('h5');

router.get(['/badanmu', '/transfer'], (req, res) => {
  res.status(200).sendFile(path.join(staticPath, 'index.html'));
});

router.use(express.static(staticPath));
