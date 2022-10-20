import express from 'express';

import { getAssetPath } from 'main/util';

export function setupStaticRouter(router: express.Router) {
  router.use(express.static(getAssetPath('transfer')));
}
