import { FC, useState } from 'react';
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
  useMantineTheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { BadanmuConfig } from 'types';

import { BadanmuState, IpcEvents } from 'const';
import { isDev } from 'lib/env';
import { useServerConfig } from 'renderer/hooks';
import { STORAGE_KEYS } from 'renderer/lib/storage';

const Badanmu: FC = () => {
  const { serverOrigin } = useServerConfig();
  const [state, setState] = useState<BadanmuState>(BadanmuState.loading);
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
      setState(BadanmuState.loading);
      ipcRenderer.invoke(IpcEvents.badanmuOpen, config);
      setState(BadanmuState.connected);
    } catch (error) {
      setState(BadanmuState.disconnected);
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

  const { colors } = useMantineTheme();

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
            disabled={connected || state === BadanmuState.loading}
            onChange={(event) => {
              setConfig((prev) => ({ ...prev, platform: event.target.value }));
            }}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label='RoomId'
            value={config.roomId}
            disabled={connected || state === BadanmuState.loading}
            onChange={(event) => {
              setConfig((prev) => ({ ...prev, roomId: event.target.value }));
            }}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Group noWrap>
            <Button
              disabled={
                state === BadanmuState.loading ||
                !config.platform ||
                !config.roomId
              }
              onClick={connected ? handleDisconnectClick : handleConnectClick}
            >
              {connected ? 'Disconnect' : 'Connect'}
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
      <webview
        title='Badanmu'
        src={isDev ? 'http://localhost:1214/badanmu' : url}
        // src='https://www.baidu.com'
        // allowtransparency='true'
        frameBorder={0}
        style={{
          width: 360,
          height: 640,
          background: 'none transparent',
          border: `1px solid ${colors.gray[0]}`,
          outline: 'none',
        }}
      />
    </Stack>
  );
};

Badanmu.displayName = 'Badanmu';

export default Badanmu;
