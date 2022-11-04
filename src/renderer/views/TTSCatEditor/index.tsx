import { useState } from 'react';
import { Divider, Input, Stack } from '@mantine/core';

import { withWindow } from 'renderer/components';
import { useFn } from 'renderer/hooks';

import { SsmlConfig, SsmlDistributor } from '../MicrosoftTTS/SsmlDistributor';
import { aiConfigStorage, textConfigStorage } from '../TTSCat';

import { AiChatEditor } from './AiChatEditor';

interface Props {
  initialData: {
    textConfig: SsmlConfig;
    aiConfig: string[];
  };
}

function TTSCatEditor({ initialData: { textConfig, aiConfig } }: Props) {
  const [privTextConfig, setPrivTextConfig] = useState(textConfig);
  const [privAiConfig, setPrivAiConfig] = useState(aiConfig);
  const handleTextConfigChange = useFn((config: SsmlConfig) => {
    setPrivTextConfig(config);
    textConfigStorage.set(config);
  });
  const handleAiConfigChange = useFn((config: string[]) => {
    setPrivAiConfig(config);
    aiConfigStorage.set(config);
  });

  return (
    <Stack spacing='md'>
      <Input.Wrapper label='Danmuji'>
        <SsmlDistributor
          value={privTextConfig}
          onChange={handleTextConfigChange}
        />
      </Input.Wrapper>
      <Divider />
      <Input.Wrapper label='Danmuji with AI chat'>
        <AiChatEditor value={privAiConfig} onChange={handleAiConfigChange} />
      </Input.Wrapper>
    </Stack>
  );
}

export default withWindow(TTSCatEditor);
