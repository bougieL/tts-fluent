import { useState } from 'react';
import { useAsync } from 'react-use';
import address from 'address';
import fs from 'fs-extra';

import { TransferCache } from 'caches';

export function useServerConfig() {
  const [config, setConfig] = useState<TransferCache.ServerConfig>();
  useAsync(async () => {
    const updater = async () => {
      const c = await TransferCache.getServerConfig();
      setConfig(c);
    };
    const p = await TransferCache.getServerConfigPath();
    updater();
    fs.watch(p, updater);
  }, []);

  const ip = address.ip();

  return {
    serverOrigin: `http://${ip}:${config?.serverPort}`,
    serverName: config?.serverName,
    serverPort: config?.serverPort,
    serverIp: ip,
  };
}
