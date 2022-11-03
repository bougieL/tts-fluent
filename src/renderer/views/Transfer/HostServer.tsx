import { useEffect, useRef } from 'react';
import { clipboard, shell } from 'electron';
import qrcode from 'qrcode';

import {
  Alert,
  Anchor,
  Group,
  IconCircleCheck,
  Input,
  Stack,
  Text,
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
    <Stack spacing='xs'>
      <Alert
        color='green'
        icon={<IconCircleCheck size={16} />}
        styles={{
          root: {
            padding: '6px 12px',
          },
        }}
      >
        <Text size='sm'>
          Start transfer server in {serverName} success, scan the qrcode to
          transfer files.&nbsp;
          <Anchor
            onClick={() => {
              shell.openExternal(serverUrl);
            }}
          >
            Open transfer page
          </Anchor>
          {process.env.NODE_ENV === 'development' && (
            <Anchor
              onClick={() => {
                shell.openExternal(debugUrl);
              }}
            >
              &nbsp;Open debug transfer page
            </Anchor>
          )}
        </Text>
      </Alert>
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
