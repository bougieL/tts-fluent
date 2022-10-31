import { useEffect, useState } from 'react';

import { DefaultButton, PrimaryButton, Stack } from 'renderer/components';
import { useFn } from 'renderer/hooks';
import { createStorage, openSubWindow } from 'renderer/lib';

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

export const textConfigStorage = createStorage('tts_cat', defaultConfig);

const defaultAiConfig = ['zh-CN-YunxiNeural', 'zh-CN-XiaoyouNeural'];

export const aiConfigStorage = createStorage(
  'tts_cat_ai_chat',
  defaultAiConfig
);

const TTSCat = () => {
  const [textConfig, setTextConfig] = useState(textConfigStorage.get());
  const [aiConfig, setAiConfig] = useState(aiConfigStorage.get());
  const handleConfigChange = useFn(() => {
    setTextConfig(textConfigStorage.get());
    setAiConfig(aiConfigStorage.get());
  });
  useEffect(() => {
    window.addEventListener('storage', handleConfigChange);

    return () => {
      window.removeEventListener('storage', handleConfigChange);
    };
  }, [handleConfigChange]);

  const handleEdit = () => {
    openSubWindow('/window/ttsCatEditor', {
      title: 'TTSCat edit',
      textConfig,
      aiConfig,
    });
  };

  const handleEditInterceptor = () => {
    openSubWindow('/window/codeEditor', {
      title: 'TTSCat edit',
      width: 600,
      content: 'console.log("hello world")',
    });
  };

  const handleReset = () => {
    if (confirm('Reset to default value ?')) {
      textConfigStorage.reset();
      aiConfigStorage.reset();
      setTextConfig(defaultConfig);
      setAiConfig(defaultAiConfig);
    }
  };

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { height: '100%' } }}>
      <Display textConfig={textConfig} aiChatConfig={aiConfig} />
      <Stack
        horizontal
        horizontalAlign="end"
        styles={{ root: { paddingTop: 36 } }}
        tokens={{ childrenGap: 12 }}
      >
        <DefaultButton onClick={handleEditInterceptor}>
          Edit interceptor
        </DefaultButton>
        <DefaultButton onClick={handleReset}>Reset</DefaultButton>
        <PrimaryButton onClick={handleEdit}>Edit</PrimaryButton>
      </Stack>
    </Stack>
  );
};

export default TTSCat;
