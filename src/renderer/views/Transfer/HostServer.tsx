import { useEffect, useRef } from 'react';
import { clipboard, shell } from 'electron';
import qrcode from 'qrcode';

import {
  FStack,
  Label,
  Link,
  MessageBar,
  MessageBarType,
} from 'renderer/components';
import { useServerConfig } from 'renderer/hooks';

interface HostServerProps {
  bottomSlot: React.ReactNode;
  rightSlot: React.ReactNode;
}

export function HostServer({ rightSlot, bottomSlot }: HostServerProps) {
  const { serverOrigin, serverName, serverIp } = useServerConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const serverUrl = `${serverOrigin}/transfer`;
  const debugUrl = `http://${serverIp}:1213/transfer`;
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
    <FStack tokens={{ childrenGap: 12 }} styles={{ root: { flex: 1 } }}>
      <MessageBar messageBarType={MessageBarType.success}>
        Start transfer server in {serverName} success, scan the qrcode to
        transfer files.
        <Link
          href='##'
          onClick={(event) => {
            event.preventDefault();
            shell.openExternal(serverUrl);
          }}
        >
          Open transfer page
        </Link>
        {process.env.NODE_ENV === 'development' && (
          <Link
            href='##'
            onClick={(event) => {
              event.preventDefault();
              shell.openExternal(debugUrl);
            }}
          >
            Open debug transfer page
          </Link>
        )}
      </MessageBar>
      <FStack horizontal tokens={{ childrenGap: 12 }}>
        <FStack tokens={{ childrenGap: 12 }}>
          <FStack>
            <Label>Qrcode</Label>
            <canvas
              ref={canvasRef}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                clipboard.writeText(serverUrl);
                new Notification('Server url copied to clipboard 😁').onclick =
                  () => {};
              }}
            />
          </FStack>
          {bottomSlot}
        </FStack>
        {rightSlot}
      </FStack>
    </FStack>
  );
}
