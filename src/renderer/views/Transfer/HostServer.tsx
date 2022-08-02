import { Label, Link, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { TransferCache } from 'caches/transfer';
import { shell } from 'electron';
import fs from 'fs-extra';
import { useEffect, useRef, useState } from 'react';
import qrcode from 'qrcode';
import { useAsync } from 'renderer/hooks';

interface HostServerProps {
  slot: React.ReactNode;
}

export function HostServer({ slot }: HostServerProps) {
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!config?.serverHost) return;
    qrcode.toCanvas(
      canvasRef.current,
      config.serverHost,
      {
        width: 200,
        scale: 0,
        margin: 0,
      },
      (error) => {
        if (error) console.error(error);
        console.log('success!');
      }
    );
  }, [config?.serverHost]);
  if (!config) {
    return null;
  }
  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { flex: 1 } }}>
      <MessageBar messageBarType={MessageBarType.success}>
        Start transfer server in {config.serverName} success, scan the qrcode to
        transfer files.
        <Link
          href={config.serverHost}
          target="_blank"
          onClick={(event) => {
            event.preventDefault();
            shell.openExternal(config.serverHost);
          }}
        >
          Open transfer page
        </Link>
      </MessageBar>
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <Stack>
          <Label>Qrcode</Label>
          <canvas ref={canvasRef} />
        </Stack>
        {slot}
      </Stack>
    </Stack>
  );
}
