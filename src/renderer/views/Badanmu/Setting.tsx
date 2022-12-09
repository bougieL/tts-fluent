import { useMemo } from 'react';
import { Checkbox, NumberInput, Stack } from '@mantine/core';
import { IBadanmuSetting } from 'types';

import { isDev } from 'lib/env';
import { useServerConfig } from 'renderer/hooks';

export function Setting({
  config,
  onConfigChange,
}: {
  config: IBadanmuSetting;
  onConfigChange(
    val: IBadanmuSetting | ((prevState: IBadanmuSetting) => IBadanmuSetting)
  ): void;
}) {
  return (
    <Stack>
      <Checkbox
        label='Show background'
        checked={config.background}
        onChange={(event) => {
          onConfigChange((prev) => ({
            ...prev,
            background: event.target.checked,
          }));
        }}
      />
      <Checkbox
        label='Speak danmu'
        checked={config.speak}
        onChange={(event) => {
          onConfigChange((prev) => ({
            ...prev,
            speak: event.target.checked,
          }));
        }}
      />
      <Checkbox
        label='AI chat'
        checked={config.aiChat}
        onChange={(event) => {
          onConfigChange((prev) => ({
            ...prev,
            aiChat: event.target.checked,
          }));
        }}
      />
      <Checkbox
        label='Float window'
        checked={config.floatWindow}
        onChange={(event) => {
          onConfigChange((prev) => ({
            ...prev,
            floatWindow: event.target.checked,
          }));
        }}
      />
      <NumberInput
        label='Width'
        value={config.width}
        onChange={(width: number) =>
          (width || 0) > 0 && onConfigChange((prev) => ({ ...prev, width }))
        }
      />
      <NumberInput
        label='Height'
        value={config.height}
        onChange={(height: number) =>
          (height || 0) > 0 && onConfigChange((prev) => ({ ...prev, height }))
        }
      />
    </Stack>
  );
}

export function useUrlsBySetting(config: IBadanmuSetting) {
  const { serverOrigin, serverPort } = useServerConfig();

  const searchParams = useMemo(() => {
    const params = new URLSearchParams();
    if (config.background) {
      params.set('background', '1');
    }
    if (config.speak) {
      params.set('speak', '1');
    }
    if (config.aiChat) {
      params.set('aiChat', '1');
    }
    const str = params.toString();
    return str ? `?${str}` : '';
  }, [config.aiChat, config.background, config.speak]);

  const url = `${serverOrigin}/badanmu${searchParams}`;

  const floatUrl = isDev ? `http://localhost:1213/badanmu${searchParams}` : url;

  let webUrl = floatUrl;

  if (config.floatWindow) {
    webUrl = floatUrl.replace('speak=', 'speakNo=');
  }

  const urls = [
    `http://localhost:${serverPort}/badanmu${searchParams}`,
    `http://127.0.0.1:${serverPort}/badanmu${searchParams}`,
    url,
  ];

  return {
    webUrl,
    floatUrl,
    urls,
    serverPort,
  };
}
