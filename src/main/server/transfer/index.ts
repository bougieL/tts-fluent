import { Router } from 'express';

import { setupAliveRouter } from './alive';
import { setupDataStreamRouter } from './dataStream';

const router = Router();

setupAliveRouter(router);
setupDataStreamRouter(router);

export { router };
