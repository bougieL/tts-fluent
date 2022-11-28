import { useEffect, useRef } from 'react';
import { clipboard, shell } from 'electron';
import {
  Alert,
  Anchor,
  Group,
  Input,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons';
import qrcode from 'qrcode';

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

  const { colorScheme } = useMantineTheme();

  useEffect(() => {
    if (!serverName) return;
    qrcode.toCanvas(
      canvasRef.current,
      serverUrl,
      {
        width: 250,
        scale: 0,
        margin: 0,
        color:
          colorScheme === 'dark'
            ? {
                dark: '#ffffff',
                light: '#1a1b1e',
              }
            : {
                light: '#ffffff',
                dark: '#1a1b1e',
              },
      },
      (error) => {
        if (error) console.error(error);
        else console.log('success!');
      }
    );
  }, [colorScheme, serverName, serverUrl]);

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
            <Tooltip label='Click to copy url'>
              <canvas
                ref={canvasRef}
                style={{
                  cursor: 'pointer',
                  width: 250,
                  height: 250,
                  borderRadius: 4,
                }}
                onClick={() => {
                  clipboard.writeText(serverUrl);
                  new Notification(
                    'Server url copied to clipboard 😁'
                  ).onclick = () => {};
                }}
              />
            </Tooltip>
          </Input.Wrapper>
          {bottomSlot}
        </Stack>
        {rightSlot}
      </Group>
    </Stack>
  );
}
