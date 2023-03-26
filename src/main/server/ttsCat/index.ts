import { Router } from 'express';

import { setupAiChatRouter } from './aiChat';
import { setupTextRouter } from './text';

const router = Router();

setupTextRouter(router);
setupAiChatRouter(router);

export { router };
