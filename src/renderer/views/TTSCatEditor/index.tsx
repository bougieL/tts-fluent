import { Divider, Input, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import { withWindow } from 'renderer/components';
import { STORAGE_KEYS } from 'renderer/lib/storage';

import { SsmlConfig, SsmlDistributor } from '../MicrosoftTTS/SsmlDistributor';

import { AiChatEditor } from './AiChatEditor';

interface Props {
  initialData: {
    textConfig: SsmlConfig;
    aiConfig: string[];
  };
}

function TTSCatEditor({ initialData: { textConfig, aiConfig } }: Props) {
  const [privTextConfig, setPrivTextConfig] = useLocalStorage({
    key: STORAGE_KEYS.ttsCat,
    defaultValue: textConfig,
    getInitialValueInEffect: false,
  });
  const [privAiConfig, setPrivAiConfig] = useLocalStorage({
    key: STORAGE_KEYS.ttsCatAiChat,
    defaultValue: aiConfig,
    getInitialValueInEffect: false,
  });

  return (
    <Stack spacing='md'>
      <Input.Wrapper label='Danmuji'>
        <SsmlDistributor value={privTextConfig} onChange={setPrivTextConfig} />
      </Input.Wrapper>
      <Divider />
      <Input.Wrapper label='Danmuji with AI chat'>
        <AiChatEditor value={privAiConfig} onChange={setPrivAiConfig} />
      </Input.Wrapper>
    </Stack>
  );
}

export default withWindow(TTSCatEditor);
