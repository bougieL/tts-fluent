import { shell } from 'electron';
import React, { useMemo } from 'react';
import { Link, Separator, Stack, Text } from 'renderer/components';
import { useServerConfig } from 'renderer/hooks';

import { SsmlConfig } from '../MicrosoftTTS/Options';

interface Props {
  ssmlConfig: SsmlConfig;
}

export function Inputs({ ssmlConfig }: Props) {
  const { serverHost, serverPort } = useServerConfig();

  const { voice, style, rate, pitch, outputFormat } = ssmlConfig;

  const params = useMemo(() => {
    return `${new URLSearchParams({
      voice,
      style,
      rate,
      pitch,
      outputFormat,
    }).toString()}`;
  }, [outputFormat, pitch, rate, style, voice]);

  const base1 = `http://127.0.0.1:${serverPort}/ttsCat?${params}`;
  const base2 = `${serverHost}/ttsCat?${params}`;

  const url1 = `${base1}&text=$TTSTEXT`;
  const url2 = `${base2}&text=$TTSTEXT`;

  const example1 = `${base1}&text=${encodeURIComponent('黱榎韡縩赑')}`;
  const example2 = `${base2}&text=${encodeURIComponent('黱榎韡縩赑')}`;

  const createClick =
    (url: string, open = false) =>
    (event: React.MouseEvent) => {
      event.preventDefault();
      navigator.clipboard.writeText(url);
      new Notification('Url copied to clipboard 😄').onclick = () => {};
      if (open) {
        shell.openExternal(url);
      }
    };

  const renderContent = () => {
    if (!serverPort) {
      return null;
    }
    return (
      <Stack style={{ paddingTop: 12 }} tokens={{ childrenGap: 6 }}>
        <Stack>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
            Used for local device
          </Text>
          <Link href="##" style={{ fontSize: 12 }} onClick={createClick(url1)}>
            {url1}
          </Link>
        </Stack>
        <Stack>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Example</Text>
          <Link
            href="##"
            style={{ fontSize: 12 }}
            onClick={createClick(example1, true)}
          >
            {example1}
          </Link>
        </Stack>
        <Separator />
        <Stack>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
            Used for LAN devices
          </Text>
          <Link href="##" style={{ fontSize: 12 }} onClick={createClick(url2)}>
            {url2}
          </Link>
        </Stack>
        <Stack>
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Example</Text>
          <Link
            href="##"
            style={{ fontSize: 12 }}
            onClick={createClick(example2, true)}
          >
            {example2}
          </Link>
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack
      tokens={{ childrenGap: 18 }}
      styles={{
        root: {
          width: '100%',
          height: 'calc(100vh - 294px)',
        },
      }}
    >
      {renderContent()}
    </Stack>
  );
}
