import { useState } from 'react';

import { FStack, FText, Separator, withWindow } from 'renderer/components';
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
    <FStack
      tokens={{ childrenGap: 12 }}
      styles={{ root: { paddingLeft: 12, paddingRight: 12 } }}
    >
      <FText style={{ fontWeight: 'bold' }}>Danmuji</FText>
      <SsmlDistributor
        value={privTextConfig}
        onChange={handleTextConfigChange}
      />
      <Separator />
      <FText style={{ fontWeight: 'bold' }}>Danmuji with AI chat</FText>
      <AiChatEditor value={privAiConfig} onChange={handleAiConfigChange} />
    </FStack>
  );
}

export default withWindow(TTSCatEditor);
