import { Router } from 'express';

import { setupQykRouter } from './qyk';
import { setupTextRouter } from './text';

const router = Router();

setupTextRouter(router);
setupQykRouter(router);

export { router };
