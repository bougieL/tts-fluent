import express from 'express';

import { getAssetPath } from 'main/util';

export function setupStaticRouter(router: express.Router) {
  const staticPath = getAssetPath('badanmu');
  router.use(express.static(staticPath));
}
