import { useState } from 'react';

import { Divider, Stack, Text, withWindow } from 'renderer/components';
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
      <Text style={{ fontWeight: 'bold' }}>Danmuji</Text>
      <SsmlDistributor
        value={privTextConfig}
        onChange={handleTextConfigChange}
      />
      <Divider />
      <Text style={{ fontWeight: 'bold' }}>Danmuji with AI chat</Text>
      <AiChatEditor value={privAiConfig} onChange={handleAiConfigChange} />
    </Stack>
  );
}

export default withWindow(TTSCatEditor);
