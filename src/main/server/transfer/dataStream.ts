import { app, clipboard, Notification } from 'electron';
import { Router, Request } from 'express';
import fs from 'fs-extra';
import multer from 'multer';

export function setupDataStreamRouter(router: Router) {
  router.get('/file/:path', async (req: Request<{ path: string }>, res) => {
    const { params } = req;
    const readStream = fs.createReadStream(params.path);
    readStream.pipe(res);
  });

  const upload = multer({ dest: app.getPath('downloads') });

  router.post('/files', upload.array('files'), async (req, res) => {
    // req.on('data');
    res.send('ok');
  });

  router.get('/clipboard', async (req, res) => {
    res.send(clipboard.readText());
  });

  router.post('/clipboard', async (req: Request<any, any>, res) => {
    // console.log('req.body === ', req.body);
    if (req.body) {
      clipboard.writeText(req.body.data);
      new Notification({
        title: 'Clipboard updated',
        body: `Successfully get clipboard from ${req.query.deviceName}`,
      }).show();
    }
    res.send('ok');
  });
}
