import { useState } from 'react';

import { PrimaryButton, Stack } from 'renderer/components';
import { useFn } from 'renderer/hooks';
import { createStorage } from 'renderer/lib';

import { SsmlConfig } from '../MicrosoftTTS/SsmlDistributor';

import { Display } from './Display';

const defaultConfig: SsmlConfig = {
  locale: 'Chinese (Mandarin, Simplified)',
  voice: 'zh-CN-XiaoxiaoNeural',
  rate: '0%',
  pitch: '0%',
  style: 'general',
  outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
};

const textConfigStorage = createStorage('tts_cat', defaultConfig);

const defaultAiConfig = ['zh-CN-YunxiNeural', 'zh-CN-XiaoyouNeural'];

const aiConfigStorage = createStorage('tts_cat_ai_chat', defaultAiConfig);

const TTSCat = () => {
  const [textConfig, setTextConfig] = useState(textConfigStorage.get());
  const [aiConfig, setAiConfig] = useState(aiConfigStorage.get());
  const handleTextConfigChange = useFn((config: SsmlConfig) => {
    setTextConfig(config);
    textConfigStorage.set(config);
  });
  const handleAiConfigChange = useFn((config: string[]) => {
    setAiConfig(config);
    aiConfigStorage.set(config);
  });

  // const handleEdit = () => {
  //   openWindow('/window/ttsCatEditor', {
  //     title: 'TTSCat edit',
  //     width: 600,
  //     textConfig,
  //     onTextConfigChange: handleTextConfigChange,
  //     aiConfig,
  //     onAiConfigChange: handleAiConfigChange,
  //   });
  // };

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { height: '100%' } }}>
      <Display textConfig={textConfig} aiChatConfig={aiConfig} />
      <Stack horizontalAlign="end">
        {/* <PrimaryButton onClick={handleEdit}>Edit</PrimaryButton> */}
      </Stack>
      {/* <SsmlDistributor value={config} onChange={handleConfigChange} /> */}
    </Stack>
  );
};

export default TTSCat;
