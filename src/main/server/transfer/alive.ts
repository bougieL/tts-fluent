import { Response, Router } from 'express';
import { ipcMain } from 'electron';

import { TransferCache } from 'caches';
import { IpcEvents } from 'const';
import { TransferType } from 'const/Transfer';

import { getServerName, getServerOrigin } from '../utils';

export function setupAliveRouter(router: Router) {
  const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
  const responses = new Map<string, Response>();

  ipcMain.on(IpcEvents.transferSSEData, (_, payload) => {
    Array.from(responses.values()).forEach((res) => {
      res.write(toEventStreamData(payload));
    });
  });

  router.get('/deviceAlivePolling', async (req, res) => {
    const { query } = req;
    const deviceId = query.deviceId as string;
    TransferCache.connect({
      deviceId,
      deviceName: query.deviceName as string,
      deviceHost: req.ip,
    });
    clearTimeout(timerMap.get(deviceId));
    timerMap.set(
      deviceId,
      setTimeout(() => {
        TransferCache.disconnect(deviceId);
        timerMap.delete(deviceId);
        responses.get(deviceId)?.end();
        responses.delete(deviceId);
      }, 8000)
    );
    res.status(200).send({
      serverName: getServerName(),
      serverOrigin: await getServerOrigin(),
    });
  });

  router.get('/serverAliveSse', async (req, res) => {
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
