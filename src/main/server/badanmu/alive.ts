import { Response, Router } from 'express';
import { ipcMain } from 'electron';
import { createClient } from '@bougiel/badanmu';
import { BadanmuConfig } from 'types';
import * as uuid from 'uuid';

import { BadanmuState, BadanmuType, IpcEvents } from 'const';
import { getMainWindow } from 'main/windows/main';

export async function setupAliveRouter(router: Router) {
  const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
  const responses = new Map<string, Response>();

  let client: ReturnType<typeof createClient> | undefined;

  const sendSse = (data: { type: BadanmuType; payload: any }) => {
    Array.from(responses.values()).forEach((res) => {
      res.write(toEventStreamData(data));
    });
  };

  const handleMessage = (msg: any) => {
    sendSse({ type: BadanmuType.message, payload: msg });
  };

  const handleClose = async () => {
    sendSse({
      type: BadanmuType.disconnect,
      payload: {
        uuid: uuid.v4(),
        platform: client?.platform,
        roomId: client?.roomID,
      },
    });
    client?.off('message', handleMessage);
    client = undefined;
    const mainWindow = await getMainWindow(false);
    mainWindow?.webContents.send(
      IpcEvents.badanmuState,
      BadanmuState.disconnected
    );
  };

  ipcMain.handle(IpcEvents.badanmuOpen, (_, config: BadanmuConfig) => {
    client = createClient(config.platform, config.roomId);
    return new Promise((resolve, reject) => {
      client?.on('open', () => {
        sendSse({
          type: BadanmuType.connect,
          payload: {
            uuid: uuid.v4(),
            platform: client?.platform,
            roomId: client?.roomID,
          },
        });
        client?.on('message', handleMessage);
        client?.once('close', handleClose);
        resolve('ok');
      });
      client?.on('error', reject);
    });
  });

  ipcMain.handle(IpcEvents.badanmuClose, (_) => {
    client?.stop();
    client?.off('message', handleMessage);
    client = undefined;
  });

  ipcMain.handle(IpcEvents.badanmuState, () => {
    return client ? BadanmuState.connected : BadanmuState.disconnected;
  });

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
      }, 20000)
    );
    res.status(200).send({
      platform: client?.platform,
      roomId: client?.roomID,
      state: client ? BadanmuState.connected : BadanmuState.disconnected,
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
      type: BadanmuType.heartbeat,
      payload: {
        platform: client?.platform,
        roomId: client?.roomID,
        state: client ? BadanmuState.connected : BadanmuState.disconnected,
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
