import { Router } from 'express';

import { setupAliveRouter } from './alive';

const router = Router();

setupAliveRouter(router);

export { router };
