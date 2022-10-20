import { useMemo } from 'react';
import { Separator, Stack, Text } from 'renderer/components';
import { useServerConfig } from 'renderer/hooks';
import { SsmlConfig } from '../MicrosoftTTS/Options';

interface Props {
  ssmlConfig: SsmlConfig;
}

export function Inputs({ ssmlConfig }: Props) {
  const { serverHost, serverPort } = useServerConfig();

  const { voice, style, rate, pitch, outputFormat } = ssmlConfig;

  const params = useMemo(() => {
    return `voice=${encodeURIComponent(voice)}&style=${encodeURIComponent(
      style
    )}&rate=${encodeURIComponent(rate)}&pitch=${encodeURIComponent(
      pitch
    )}&outputFormat=${encodeURIComponent(outputFormat)}&text=$TTSTEXT`;
  }, [outputFormat, pitch, rate, style, voice]);

  const url1 = `http://127.0.0.1:${serverPort}/ttsCat?${params}`;
  const url2 = `${serverHost}/ttsCat?${params}`;

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    new Notification('Url copied to clipboard 😄').onclick = () => {};
  };

  const renderContent = () => {
    if (!serverPort) {
      return null;
    }
    return (
      <Stack
        style={{ paddingLeft: 12, cursor: 'pointer' }}
        tokens={{ childrenGap: 12 }}
      >
        <Stack onClick={() => copy(url1)}>
          <Text variant="large">Used for local device</Text>
          <Text>{url1}</Text>
        </Stack>
        <Separator />
        <Stack onClick={() => copy(url2)}>
          <Text variant="large">Used for LAN devices</Text>
          <Text onClick={() => copy(url2)}>{url2}</Text>
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
          height: 'calc(100vh - 290px)',
        },
      }}
    >
      {renderContent()}
    </Stack>
  );
}
