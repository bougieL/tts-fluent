import { Response, Router } from 'express';
import { ipcMain } from 'electron';
import { createClient } from 'badanmu';
import { BadanmuConfig } from 'types';

import { BadanmuState, IpcEvents } from 'const';
import { TransferType } from 'const/Transfer';

import { getServerName, getServerOrigin } from '../utils';

let client: ReturnType<typeof createClient> | null = null;

ipcMain.handle(IpcEvents.badanmuOpen, (_, config: BadanmuConfig) => {
  client = createClient(config.platform, config.roomId);
  return new Promise((resolve, reject) => {
    client?.on('open', () => resolve('ok'));
    client?.on('error', reject);
  });
});

ipcMain.handle(IpcEvents.badanmuClose, (_) => {
  client?.stop();
  client = null;
});

ipcMain.handle(IpcEvents.badanmuState, () => {
  return client ? BadanmuState.connected : BadanmuState.disconnected;
});

export function setupAliveRouter(router: Router) {
  const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
  const responses = new Map<string, Response>();

  router.get('/deviceAlivePolling', async (req, res) => {
    const { query } = req;
    const deviceId = query.deviceId as string;
    clearTimeout(timerMap.get(deviceId));
    timerMap.set(
      deviceId,
      setTimeout(() => {
        timerMap.delete(deviceId);
        responses.get(deviceId)?.end();
        responses.delete(deviceId);
      }, 10000)
    );
    res.status(200).send({
      serverName: getServerName(),
      serverOrigin: await getServerOrigin(),
      state: client ? BadanmuState.connected : BadanmuState.disconnected,
    });
  });

  client?.on('message', (msg) => {
    Array.from(responses.values()).forEach((res) => {
      res.write(toEventStreamData(msg));
    });
  });

  router.get('/message', async (req, res) => {
    const deviceId = req.query.deviceId as string;
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    const heartbeatData = toEventStreamData({
      type: TransferType.heartbeat,
      payload: {
        serverName: getServerName(),
        serverOrigin: await getServerOrigin(),
      },
    });
    res.write(heartbeatData);
    responses.set(deviceId, res);
  });
}

function toEventStreamData(data: any) {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return `data: ${str}\n\n`;
}
