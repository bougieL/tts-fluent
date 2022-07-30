import { IpcEvents } from 'const';
import { ipcMain } from 'electron';
import { Router, Request } from 'express';
import { v4 } from 'uuid';
import { getServerName, getServerHost } from '../utils';

export namespace Devices {
  export interface Device {
    deviceId: string;
    deviceName: string;
    deviceHost: string;
  }

  const devices: Device[] = [];

  export function notifyDevicesUpdate() {
    ipcMain.emit(IpcEvents.transferDevicesUpdate, devices);
  }

  export function connect(device: Device) {
    const index = devices.findIndex(
      (item) => item.deviceId === device.deviceId
    );
    if (index > -1) {
      devices[index] = device;
    } else {
      devices.unshift(device);
    }
    notifyDevicesUpdate();
  }

  export function disconnect(id: string) {
    const index = devices.findIndex((item) => item.deviceId === id);
    delete devices[index];
    notifyDevicesUpdate();
  }
}

export function setupAliveRouter(router: Router) {
  const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
  router.get(
    '/deviceAlivePolling',
    async (req: Request<{ deviceId: string; deviceName: string }>, res) => {
      const { params, cookies } = req;
      const deviceId = cookies.uuid || v4();
      res.cookie('deviceId', deviceId);
      Devices.connect({
        deviceId,
        deviceName: params.deviceName,
        deviceHost: req.ip,
      });
      clearTimeout(timerMap.get(deviceId));
      timerMap.set(
        deviceId,
        setTimeout(() => {
          Devices.disconnect(deviceId);
          timerMap.delete(deviceId);
        }, 5000)
      );
      res.status(200).send({
        serverName: getServerName(),
        serverHost: await getServerHost(),
      });
    }
  );

  router.get('/hostAliveSse', async (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write({
      serverName: getServerName(),
      serverHost: await getServerHost(),
    });
  });
}
