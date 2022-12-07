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

  const sendSse = (type: BadanmuType, payload: any = {}) => {
    Array.from(responses.values()).forEach((res) => {
      res.write(
        toEventStreamData({
          type,
          payload: {
            ...payload,
            uuid: uuid.v4(),
            platform: client?.platform,
            roomId: client?.roomID,
          },
        })
      );
    });
  };

  const sendState = async (data: any) => {
    const mainWindow = await getMainWindow(false);
    mainWindow?.webContents.send(IpcEvents.badanmuState, data);
  };

  function connectWithRetry(platform: string, roomId: string | number) {
    client = createClient(platform, roomId);
    sendState(BadanmuState.connected);
    client.on('open', () => {
      sendSse(BadanmuType.connect);
      client?.on('message', (msg: any) => {
        switch (msg.type) {
          case 'comment':
            sendSse(BadanmuType.comment, msg);
            break;
          case 'gift':
            sendSse(BadanmuType.gift, msg);
            break;
          case 'system':
            if (msg.msgType === 1) {
              sendSse(BadanmuType.enter, msg);
            } else if (msg.msgType === 2) {
              sendSse(BadanmuType.follow, msg);
            }
            break;
          default:
            break;
        }
      });
      client?.on('error', (error) => {
        sendSse(BadanmuType.error, {
          data: String(error),
        });
      });
      client?.once('close', async (code, reason) => {
        if (code === 1000) {
          client = undefined;
          sendSse(BadanmuType.disconnectManually);
          sendState(BadanmuState.disconnected);
          return;
        }
        console.error(reason);
        sendState(BadanmuState.error);
        setTimeout(connectWithRetry.bind(null, platform, roomId), 5000);
      });
    });
  }

  ipcMain.handle(IpcEvents.badanmuOpen, (_, config: BadanmuConfig) => {
    connectWithRetry(config.platform, config.roomId);
  });

  ipcMain.handle(IpcEvents.badanmuClose, (_) => {
    client?.stop();
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
      uuid: uuid.v4(),
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
