import express from 'express';
import cookieParser from 'cookie-parser';

import { TransferCache } from 'caches/transfer';

import { router as transferRouter } from './transfer';
import { router as ttsCatRouter } from './ttsCat';
import { getServerName, getServerPort } from './utils';

const app = express();

app.use(cookieParser());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', (_, res) => res.send('TTS Fluent services running.'));
app.use('/transfer', transferRouter);
app.use('/ttsCat', ttsCatRouter);

export async function setupSever() {
  await TransferCache.clear();
  const port = await getServerPort();
  return app.listen(port, () => {
    TransferCache.writeServerConfig({
      serverPort: port,
      serverName: getServerName(),
    });
  });
}
