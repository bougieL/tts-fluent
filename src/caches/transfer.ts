import fs from 'fs-extra';
import path from 'path';
import { getCachesDir } from './_utils';

export namespace TransferCache {
  export const getServerConfigPath = async () => {
    const p = path.join(await getCachesDir(), 'transfer-server-config.json');
    await fs.ensureFile(p);
    return p;
  };

  export const getConnectedDevicesPath = async () => {
    const p = path.join(
      await getCachesDir(),
      'transfer-connected-devices.json'
    );
    await fs.ensureFile(p);
    return p;
  };

  export interface ServerConfig {
    serverName: string;
    serverHost: string;
  }

  export interface Device {
    deviceId: string;
    deviceName: string;
    deviceHost: string;
  }

  let devices: Device[] = [];

  export async function writeServerConfig(config: ServerConfig) {
    const p = await getServerConfigPath();
    return fs.writeFile(p, JSON.stringify(config));
  }

  export async function getServerConfig(): Promise<ServerConfig | undefined> {
    try {
      const p = await getServerConfigPath();
      return JSON.parse(await fs.readFile(p, 'utf-8'));
    } catch (error) {
      return undefined;
    }
  }

  export async function clear() {
    const [p1, p2] = await Promise.all([
      getServerConfigPath(),
      getConnectedDevicesPath(),
    ]);
    await Promise.all([fs.remove(p1), fs.remove(p2)]);
  }

  const notifyDevicesUpdate = async () => {
    const p = await getConnectedDevicesPath();
    try {
      fs.writeFile(p, JSON.stringify(devices));
    } catch (error) {
      fs.writeFile(p, '[]');
    }
  };

  export function connect(device: Device) {
    const index = devices.findIndex(
      (item) => item?.deviceId === device.deviceId
    );
    if (index > -1) {
      devices[index] = device;
    } else {
      devices.unshift(device);
    }
    // devices = devices.filter((item) => item.deviceId !== device.deviceId);
    notifyDevicesUpdate();
  }

  export function disconnect(id: string) {
    const index = devices.findIndex((item) => item?.deviceId === id);
    delete devices[index];
    notifyDevicesUpdate();
  }

  export async function getConnectedDevices(): Promise<Device[]> {
    try {
      const p = await getConnectedDevicesPath();
      return JSON.parse(await fs.readFile(p, 'utf-8'));
    } catch (error) {
      return [];
    }
  }
}
