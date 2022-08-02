import { Router } from 'express';
import { setupAliveRouter } from './alive';
import { setupDataStreamRouter } from './dataStream';
import { setupStaticRouter } from './static';

const router = Router();

setupStaticRouter(router);
setupAliveRouter(router);
setupDataStreamRouter(router);

export { router };
