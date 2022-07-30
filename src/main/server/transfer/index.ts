import { Router } from 'express';
import { setupAliveRouter } from './alive';
import { setupStaticRouter } from './static';

const router = Router();

setupStaticRouter(router);
setupAliveRouter(router);

export { router };
