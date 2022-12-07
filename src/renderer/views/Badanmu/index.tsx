import { FC, useRef, useState } from 'react';
import { useAsync } from 'react-use';
import { ipcRenderer } from 'electron';
import {
  Alert,
  Anchor,
  Button,
  Grid,
  Group,
  NativeSelect,
  Stack,
  TextInput,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { BadanmuConfig } from 'types';

import { BadanmuState, IpcEvents } from 'const';
import { isDev } from 'lib/env';
import { useServerConfig } from 'renderer/hooks';
import { STORAGE_KEYS } from 'renderer/lib/storage';

const Badanmu: FC = () => {
  const { serverOrigin } = useServerConfig();
  const [state, setState] = useState<BadanmuState>(BadanmuState.disconnected);
  const [config, setConfig] = useLocalStorage<BadanmuConfig>({
    key: STORAGE_KEYS.badanmuConfig,
    getInitialValueInEffect: false,
    defaultValue: { platform: 'bilibili', roomId: '' },
  });

  useAsync(async () => {
    setState(await ipcRenderer.invoke(IpcEvents.badanmuState));
    ipcRenderer.on(IpcEvents.badanmuState, (_, state) => {
      setState(state);
    });
  }, []);

  const handleConnectClick = () => {
    try {
      ipcRenderer.invoke(IpcEvents.badanmuOpen, config);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnectClick = () => {
    try {
      ipcRenderer.invoke(IpcEvents.badanmuClose);
      setState(BadanmuState.disconnected);
    } catch (error) {
      setState(BadanmuState.disconnected);
      console.error(error);
    }
  };

  const url = `${serverOrigin}/badanmu`;

  const connected = state === BadanmuState.connected;

  const webUrl = isDev ? 'http://localhost:1214/badanmu' : url;

  const ts = useRef(Date.now()).current;

  return (
    <Stack>
      <Alert>
        <Anchor href={url}>{url}</Anchor>
      </Alert>
      <Grid align='flex-end'>
        <Grid.Col span={3}>
          <NativeSelect
            label='Platform'
            data={['bilibili']}
            value={config.platform}
            disabled={connected}
            onChange={(event) => {
              setConfig((prev) => ({ ...prev, platform: event.target.value }));
            }}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label='RoomId'
            value={config.roomId}
            disabled={connected}
            onChange={(event) => {
              setConfig((prev) => ({ ...prev, roomId: event.target.value }));
            }}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Group noWrap>
            <Button
              disabled={!config.platform || !config.roomId}
              onClick={connected ? handleDisconnectClick : handleConnectClick}
            >
              {connected ? 'Disconnect' : 'Connect'}
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
      <webview
        title='Badanmu'
        src={webUrl}
        style={{
          width: 360,
          height: 640,
          background: 'none transparent',
          borderRadius: 4,
          overflow: 'hidden',
          backgroundSize: 'cover',
          backgroundImage: webUrl.includes('localhost')
            ? 'none'
            : `url(https://picsum.photos/360/640?t=${ts}`,
          outline: 'none',
        }}
      />
    </Stack>
  );
};

Badanmu.displayName = 'Badanmu';

export default Badanmu;
