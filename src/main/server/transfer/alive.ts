import { TransferCache } from 'caches/transfer';
import { IpcEvents } from 'const';
import { TransferType } from 'const/Transfer';
import { ipcMain } from 'electron';
import { Router, Response } from 'express';
import { v4 } from 'uuid';
import { getServerName, getServerHost } from '../utils';

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365;

export function setupAliveRouter(router: Router) {
  const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
  router.get('/deviceAlivePolling', async (req, res) => {
    const { query, cookies } = req;
    let deviceId = (query.deviceId as string) || cookies?.deviceId;
    if (!deviceId) {
      deviceId = v4();
      res.cookie('deviceId', deviceId, {
        maxAge: COOKIE_MAX_AGE,
        // httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    }
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
      }, 10000)
    );
    res.status(200).send({
      serverName: getServerName(),
      serverHost: await getServerHost(),
    });
  });

  const responses = new Map<string, Response>();
  const timers = new Map<string, ReturnType<typeof setInterval>>();

  ipcMain.on(IpcEvents.transferSSEData, (_, payload) => {
    // console.log('on ', IpcEvents.transferSSEData, payload);
    Array.from(responses.values()).forEach((res) => {
      res.write(toEventStreamData(payload));
    });
    // res.write(toEventStreamData(payload));
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
        serverHost: await getServerHost(),
      },
    });
    res.write(heartbeatData);
    clearInterval(timers.get(deviceId));
    const timer = setInterval(() => {
      res.write(heartbeatData);
    }, 5000);
    timers.set(deviceId, timer);
    responses.set(deviceId, res);
  });
}

function toEventStreamData(data: any) {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return `data: ${str}\n\n`;
}
