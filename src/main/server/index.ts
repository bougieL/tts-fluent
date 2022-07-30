import express from 'express';
import { Notification, shell } from 'electron';
import address from 'address';
import { getServerPort } from './utils';
import { router as transferRouter } from './transfer';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use('/transfer', transferRouter);

export async function setupSever() {
  const port = await getServerPort();
  return app.listen(port, () => {
    // Notification()
    const url = `http://${address.ip()}:${port}`;
    const noti = new Notification({
      title: 'Server started',
      body: 'Click here to open in browser',
    });
    noti.on('click', () => {
      shell.openExternal(url);
    });
    noti.show();
    // console.log(`Example app listening on port ${port}`);
  });
}
