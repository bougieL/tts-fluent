import { FC, useEffect, useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import { ipcRenderer, shell } from 'electron';
import {
  Anchor,
  Button,
  Group,
  List,
  NativeSelect,
  Stack,
  TextInput,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { BadanmuConfig, IBadanmuSetting } from 'types';

import { BadanmuState, IpcEvents } from 'const';
import { STORAGE_KEYS } from 'renderer/lib/storage';

import { defaultSetting } from './common';
import { Setting, useUrlsBySetting } from './Setting';

interface StyledBadanmuConfig extends BadanmuConfig {
  noop?: boolean;
}

const Badanmu: FC = () => {
  const [connectionState, setConnectionState] = useState<BadanmuState>(
    BadanmuState.disconnected
  );
  const [config, setConfig] = useLocalStorage<StyledBadanmuConfig>({
    key: STORAGE_KEYS.badanmuConfig,
    getInitialValueInEffect: false,
    defaultValue: {
      platform: 'bilibili',
      roomId: '',
    },
  });

  const [setting, setSetting] = useLocalStorage<IBadanmuSetting>({
    key: STORAGE_KEYS.badanmuSettings,
    getInitialValueInEffect: false,
    defaultValue: defaultSetting,
  });

  useAsync(async () => {
    setConnectionState(await ipcRenderer.invoke(IpcEvents.badanmuState));
    ipcRenderer.on(IpcEvents.badanmuState, (_, state) => {
      setConnectionState(state);
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
      setConnectionState(BadanmuState.disconnected);
    } catch (error) {
      setConnectionState(BadanmuState.disconnected);
      console.error(error);
    }
  };

  const connected = connectionState === BadanmuState.connected;

  const { webUrl, urls } = useUrlsBySetting(setting);

  console.log(setting);

  useEffect(() => {
    ipcRenderer.invoke(IpcEvents.badanmuFloatWindow, {
      floatWindow: setting.floatWindow,
      width: setting.width || 400,
      height: setting.height || 800,
    });
  }, [setting.floatWindow, setting.width, setting.height]);

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
          <Setting config={setting} onConfigChange={setSetting} />
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
