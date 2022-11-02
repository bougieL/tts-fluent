import { useEffect, useRef } from 'react';
import { clipboard, shell } from 'electron';
import qrcode from 'qrcode';

import {
  Group,
  Input,
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
    <Stack spacing={12}>
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
      <Group align='flex-start' noWrap>
        <Stack spacing='sm'>
          <Input.Wrapper label='Qrcode'>
            <Group>
              <canvas
                ref={canvasRef}
                style={{ cursor: 'pointer', width: 250, height: 250 }}
                onClick={() => {
                  clipboard.writeText(serverUrl);
                  new Notification(
                    'Server url copied to clipboard 😁'
                  ).onclick = () => {};
                }}
              />
            </Group>
          </Input.Wrapper>
          {bottomSlot}
        </Stack>
        {rightSlot}
      </Group>
    </Stack>
  );
}
