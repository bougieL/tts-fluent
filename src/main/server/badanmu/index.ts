import { Router } from 'express';

import { setupAliveRouter } from './alive';
import { setupStaticRouter } from './static';

const router = Router();

setupAliveRouter(router);
setupStaticRouter(router);

export { router };
