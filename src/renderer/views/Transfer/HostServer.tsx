import { useEffect, useRef } from 'react';
import { clipboard, shell } from 'electron';
import qrcode from 'qrcode';

import {
  Label,
  Link,
  MessageBar,
  MessageBarType,
  Stack,
} from 'renderer/components';
import { useServerConfig } from 'renderer/hooks';

interface HostServerProps {
  bottomSlot: React.ReactNode;
  rightSlot: React.ReactNode;
}

export function HostServer({ rightSlot, bottomSlot }: HostServerProps) {
  const { serverHost, serverName } = useServerConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const serverUrl = `http://${serverHost}/transfer`;
  useEffect(() => {
    if (!serverName) return;
    qrcode.toCanvas(
      canvasRef.current,
      serverUrl,
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
  }, [serverName, serverUrl]);
  if (!serverName) {
    return null;
  }
  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { flex: 1 } }}>
      <MessageBar messageBarType={MessageBarType.success}>
        Start transfer server in {serverName} success, scan the qrcode to
        transfer files.
        <Link
          href={serverUrl}
          target="_blank"
          onClick={(event) => {
            event.preventDefault();
            shell.openExternal(serverUrl);
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
                clipboard.writeText(serverHost);
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
