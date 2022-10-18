import qs from 'query-string';
import { Separator, Stack, Text } from 'renderer/components';
import { useServerConfig } from 'renderer/hooks';
import { SsmlConfig } from '../MicrosoftTTS/Options';

interface Props {
  ssmlConfig: SsmlConfig;
}

export function Inputs({ ssmlConfig }: Props) {
  const { serverHost, serverPort } = useServerConfig();

  const params = qs.stringify({
    voice: ssmlConfig.voice,
    style: ssmlConfig.style,
    rate: ssmlConfig.rate,
    pitch: ssmlConfig.pitch,
    outputFormat: ssmlConfig.outputFormat,
  });

  const url1 = `http://127.0.0.1:${serverPort}/ttsCat?${params}&text=$TTSTEXT`;
  const url2 = `${serverHost}/ttsCat?${params}&text=$TTSTEXT`;

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
        style={{ paddingLeft: 24, cursor: 'pointer' }}
        tokens={{ childrenGap: 18 }}
      >
        <Stack onClick={() => copy(url1)}>
          <Text variant="medium">Used for local device</Text>
          <Text>{url1}</Text>
        </Stack>
        <Separator />
        <Stack onClick={() => copy(url2)}>
          <Text variant="medium">Used for LAN devices</Text>
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
          height: 'calc(100vh - 320px)',
        },
      }}
    >
      {renderContent()}
    </Stack>
  );
}
