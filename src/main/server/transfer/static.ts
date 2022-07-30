/* eslint-disable import/extensions */
import fs from 'fs-extra';
import path from 'path';
import { isDev } from 'lib/utils';
import { Router } from 'express';

function readDevText(p: string) {
  return fs.readFile(path.resolve(__dirname, p), 'utf-8');
}

export function setupStaticRouter(router: Router) {
  router.get('/', async (req, res) => {
    let text = '';
    if (isDev) {
      text = await readDevText(
        '../../../../release/app/dist/transfer/index.html'
      );
    } else {
      text = await import(
        // @ts-ignore
        '../../../../release/app/dist/transfer/index.html?raw'
      ).then((res) => res.default);
    }
    res.send(text);
  });

  router.get('/transfer.js', async (req, res) => {
    let text = '';
    if (isDev) {
      text = await readDevText(
        '../../../../release/app/dist/transfer/transfer.js'
      );
    } else {
      text = await import(
        // @ts-ignore
        '../../../../release/app/dist/transfer/transfer.js?raw'
      ).then((res) => res.default);
    }
    res.send(text);
  });

  router.get('/style.css', async (req, res) => {
    let text = '';
    if (isDev) {
      text = await readDevText(
        '../../../../release/app/dist/transfer/style.css'
      );
    } else {
      text = await import(
        // @ts-ignore
        '../../../../release/app/dist/transfer/style.css?raw'
      );
    }
    res.send(text);
  });
}
