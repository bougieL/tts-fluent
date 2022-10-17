import {
  Label,
  Link,
  MessageBar,
  MessageBarType,
  Stack,
} from 'renderer/components';
import { TransferCache } from 'caches/transfer';
import { clipboard, shell } from 'electron';
import fs from 'fs-extra';
import { useEffect, useRef, useState } from 'react';
import qrcode from 'qrcode';
import { useAsync } from 'renderer/hooks';

interface HostServerProps {
  bottomSlot: React.ReactNode;
  rightSlot: React.ReactNode;
}

export function HostServer({ rightSlot, bottomSlot }: HostServerProps) {
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
        width: 250,
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
        Start transfer server in {config.serverPort} success, scan the qrcode to
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
        <Stack tokens={{ childrenGap: 12 }}>
          <Stack>
            <Label>Qrcode</Label>
            <canvas
              ref={canvasRef}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                clipboard.writeText(config.serverHost);
                new Notification('Server url copied to clipboard 😁').onclick =
                  () => {};
              }}
            />
          </Stack>
          {bottomSlot}
        </Stack>
        {rightSlot}
      </Stack>
    </Stack>
  );
}
