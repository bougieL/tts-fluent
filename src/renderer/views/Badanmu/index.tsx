import { FC, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import { ipcRenderer, shell } from 'electron';
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  List,
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

interface StyledBadanmuConfig extends BadanmuConfig {
  background: boolean;
  speak: boolean;
}

const Badanmu: FC = () => {
  const { serverOrigin, serverPort } = useServerConfig();
  const [state, setState] = useState<BadanmuState>(BadanmuState.disconnected);
  const [config, setConfig] = useLocalStorage<StyledBadanmuConfig>({
    key: STORAGE_KEYS.badanmuConfig,
    getInitialValueInEffect: false,
    defaultValue: {
      platform: 'bilibili',
      roomId: '',
      background: true,
      speak: true,
    },
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

  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (config.background) {
      params.set('background', '1');
    }
    if (config.speak) {
      params.set('speak', '1');
    }
    const str = params.toString();
    return str ? `?${str}` : '';
  }, [config.background, config.speak]);

  const url = `${serverOrigin}/badanmu${searchParams}`;

  const connected = state === BadanmuState.connected;

  const webUrl = isDev ? `http://localhost:1213/badanmu${searchParams}` : url;

  const urls = [
    `http://localhost:${serverPort}/badanmu${searchParams}`,
    `http://127.0.0.1:${serverPort}/badanmu${searchParams}`,
    url,
  ];

  return (
    <Stack>
      <Group align='flex-end'>
        <NativeSelect
          label='Platform'
          data={['bilibili']}
          value={config.platform}
          disabled={connected}
          onChange={(event) => {
            setConfig((prev) => ({ ...prev, platform: event.target.value }));
          }}
        />
        <TextInput
          label='RoomId'
          value={config.roomId}
          disabled={connected}
          onChange={(event) => {
            setConfig((prev) => ({ ...prev, roomId: event.target.value }));
          }}
        />
        <Button
          disabled={!config.platform || !config.roomId}
          onClick={connected ? handleDisconnectClick : handleConnectClick}
        >
          {connected ? 'Disconnect' : 'Connect'}
        </Button>
      </Group>
      <Group align='flex-start' noWrap>
        {useMemo(
          () => (
            <webview
              title='Badanmu'
              src={webUrl}
              style={{
                width: 360,
                height: 'calc(100vh - 172px)',
                background: 'none transparent',
                borderRadius: 4,
                overflow: 'hidden',
                outline: 'none',
                flexShrink: 0,
              }}
            />
          ),
          [webUrl]
        )}
        <Stack>
          <Checkbox
            label='Show background'
            checked={config.background}
            onChange={(event) => {
              setConfig((prev) => ({
                ...prev,
                background: event.target.checked,
              }));
            }}
          />
          <Checkbox
            label='Speak danmu'
            checked={config.speak}
            onChange={(event) => {
              setConfig((prev) => ({
                ...prev,
                speak: event.target.checked,
              }));
            }}
          />
          <List style={{ maxWidth: 'calc(100vw - 410px)' }}>
            {urls.map((item) => (
              <List.Item key={item}>
                <Anchor
                  onClick={() => {
                    navigator.clipboard.writeText(item);
                    shell.openExternal(item);
                  }}
                >
                  {item}
                </Anchor>
              </List.Item>
            ))}
          </List>
        </Stack>
      </Group>
    </Stack>
  );
};

Badanmu.displayName = 'Badanmu';

export default Badanmu;
