import address from 'address';
import { TransferCache } from 'caches/transfer';
import fs from 'fs-extra';
import { useState } from 'react';

import { useAsync } from './external';

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

  return {
    serverHost: `http://${address.ip()}:${config?.serverPort}`,
    serverName: config?.serverName,
    serverPort: config?.serverPort,
  };
}
