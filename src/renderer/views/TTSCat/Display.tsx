import React, { useMemo } from 'react';
import { shell } from 'electron';

import { Link, Separator, Stack, Text } from 'renderer/components';
import { useServerConfig } from 'renderer/hooks';

import { SsmlConfig } from '../MicrosoftTTS/Options';

interface Props {
  ssmlConfig: SsmlConfig;
}

export function Display({ ssmlConfig }: Props) {
  const { serverOrigin, serverPort } = useServerConfig();

  const { voice, style, rate, pitch, outputFormat } = ssmlConfig;

  const danmuUrls = useMemo(() => {
    const params = `${new URLSearchParams({
      voice,
      style,
      rate,
      pitch,
      outputFormat,
    }).toString()}`;

    const base1 = `http://127.0.0.1:${serverPort}/ttsCat?${params}`;
    const base2 = `${serverOrigin}/ttsCat?${params}`;

    const url1 = `${base1}&text=$TTSTEXT`;
    const url2 = `${base2}&text=$TTSTEXT`;
    const url3 = `${base1}&text=${encodeURIComponent('主播这操作六六六')}`;

    return {
      url1,
      url2,
      url3,
    };
  }, [outputFormat, pitch, rate, serverOrigin, serverPort, style, voice]);

  const aiChatUrls = useMemo(() => {
    const params = `${new URLSearchParams({
      outputFormat,
    }).toString()}`;

    const base1 = `http://127.0.0.1:${serverPort}/ttsCat/aiChat?${params}`;
    const base2 = `${serverOrigin}/ttsCat/aiChat?${params}`;

    const url1 = `${base1}&text=$TTSTEXT`;
    const url2 = `${base2}&text=$TTSTEXT`;
    const url3 = `${base1}&text=${encodeURIComponent('主播这操作六六六')}`;

    return {
      url1,
      url2,
      url3,
    };
  }, [outputFormat, serverOrigin, serverPort]);

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
          <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 8 }}>
            Danmuji
          </Text>
          <Stack tokens={{ childrenGap: 6 }}>
            <Link
              href="##"
              style={{ fontSize: 12 }}
              onClick={createClick(danmuUrls.url1)}
            >
              {danmuUrls.url1}
            </Link>
            <Link
              href="##"
              style={{ fontSize: 12 }}
              onClick={createClick(danmuUrls.url2)}
            >
              {danmuUrls.url2}
            </Link>
            <Link
              href="##"
              style={{ fontSize: 12 }}
              onClick={createClick(danmuUrls.url3, true)}
            >
              {danmuUrls.url3}
            </Link>
          </Stack>
        </Stack>
        <Separator />
        <Stack>
          <Text style={{ fontWeight: 'bold', fontSize: 12, marginBottom: 8 }}>
            Danmuji with qingyunke
          </Text>
          <Stack tokens={{ childrenGap: 6 }}>
            <Link
              href="##"
              style={{ fontSize: 12 }}
              onClick={createClick(aiChatUrls.url1)}
            >
              {aiChatUrls.url1}
            </Link>
            <Link
              href="##"
              style={{ fontSize: 12 }}
              onClick={createClick(aiChatUrls.url2)}
            >
              {aiChatUrls.url2}
            </Link>
            <Link
              href="##"
              style={{ fontSize: 12 }}
              onClick={createClick(aiChatUrls.url3, true)}
            >
              {aiChatUrls.url3}
            </Link>
          </Stack>
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
