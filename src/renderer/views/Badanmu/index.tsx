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
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { BadanmuConfig } from 'types';

import { BadanmuState, IpcEvents } from 'const';
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
  }, []);

  const handleConnectClick = () => {
    try {
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
            onChange={(event) => {
              setConfig((prev) => ({ ...prev, platform: event.target.value }));
            }}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            label='RoomId'
            value={config.roomId}
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
                state === BadanmuState.connected ||
                !config.platform ||
                !config.roomId
              }
              onClick={handleConnectClick}
            >
              Connect
            </Button>
            <Button
              variant='default'
              disabled={state !== BadanmuState.connected}
              onClick={handleDisconnectClick}
            >
              Disconnect
            </Button>
          </Group>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

Badanmu.displayName = 'Badanmu';

export default Badanmu;
