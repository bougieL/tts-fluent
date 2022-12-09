import { useEffect, useState } from 'react';
import { Stack } from '@mantine/core';
import { IBadanmuSetting } from 'types';

import { createStorage } from 'renderer/lib';
import { STORAGE_KEYS } from 'renderer/lib/storage';

import { defaultSetting } from './common';
import { useUrlsBySetting } from './Setting';

const storage = createStorage<IBadanmuSetting>(
  STORAGE_KEYS.badanmuSettings,
  defaultSetting
);

export function BadanmuFloatWindow() {
  const [setting, setSetting] = useState(storage.get());

  useEffect(() => {
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEYS.badanmuSettings) {
        setSetting(storage.get());
      }
    });
    document.body.style.setProperty(
      'background-color',
      'transparent',
      'important'
    );
  }, []);

  const { floatUrl, serverPort } = useUrlsBySetting(setting);

  return (
    <Stack
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {serverPort && (
        <webview
          style={{
            width: '100%',
            height: '100%',
            background: 'none transparent',
          }}
          src={floatUrl}
        />
      )}
    </Stack>
  );
}
