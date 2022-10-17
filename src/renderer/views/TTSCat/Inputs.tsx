import { Stack } from 'renderer/components';
import { SsmlConfig } from '../MicrosoftTTS/Options';

interface Props {
  ssmlConfig: SsmlConfig;
}

export function Inputs({ ssmlConfig }: Props) {
  return (
    <Stack
      tokens={{ childrenGap: 18 }}
      styles={{
        root: {
          width: '100%',
          height: 'calc(100vh - 320px)',
        },
      }}
    ></Stack>
  );
}
