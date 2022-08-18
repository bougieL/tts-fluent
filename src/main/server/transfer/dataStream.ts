import { app, clipboard, Notification, shell } from 'electron';
import { Router, Request } from 'express';
import fs from 'fs-extra';
import multer from 'multer';

export function setupDataStreamRouter(router: Router) {
  router.get('/file/:path', async (req: Request<{ path: string }>, res) => {
    const { params } = req;
    const fp = decodeURIComponent(params.path);
    // console.log(params.path)
    const stat = await fs.stat(fp);
    res.header('Content-Length', String(stat.size));
    res.header('Content-Disposition', 'attachment');
    const readStream = fs.createReadStream(decodeURIComponent(params.path));
    readStream.pipe(res);
  });

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, app.getPath('downloads'));
    },
    filename(req, file, cb) {
      const t = Date.now();
      const exts = file.originalname.split('.');
      const ext = exts.length > 1 ? exts.pop() : '';
      cb(null, `${exts.join('.')}-${t}${ext ? `.${ext}` : ''}`);
    },
  });

  const upload = multer({ storage });

  router.post('/files', upload.array('files'), async (req, res) => {
    const files = Array.isArray(req.files) ? req.files : req.files?.files;
    if (files && files.length > 0) {
      const noti = new Notification({
        title: 'Receive files successfully 😄',
        body: `From ${req.query.deviceName}`,
      });
      noti.show();
      noti.on('click', () => {
        shell.showItemInFolder(files[0].path);
      });
    }
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
