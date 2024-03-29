import os from 'os';

import address from 'address';
import detectPort from 'detect-port';

let port = 1236;

let hasFoundFreePort = false;

export async function getServerPort(): Promise<number> {
  if (hasFoundFreePort) {
    return port;
  }
  return new Promise((resolve, reject) => {
    detectPort(port, (error, _port) => {
      port = _port;
      hasFoundFreePort = true;
      resolve(_port);
    });
  });
}

export async function getServerOrigin() {
  const port = await getServerPort();
  return `http://${address.ip()}:${port}`;
}

export function getServerName() {
  return `${os.userInfo().username}@${os.hostname()}`;
}
