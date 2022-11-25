import { FC, useEffect } from 'react';
import { Button, Group, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import { createStorage, openSubWindow } from 'renderer/lib';
import { STORAGE_KEYS } from 'renderer/lib/storage';

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

const textConfigStorage = createStorage(STORAGE_KEYS.ttsCat, defaultConfig);

const defaultAiConfig = ['zh-CN-YunxiNeural', 'zh-CN-XiaoyouNeural'];

const aiConfigStorage = createStorage(
  STORAGE_KEYS.ttsCatAiChat,
  defaultAiConfig
);

const TTSCat: FC = () => {
  const [textConfig, setTextConfig] = useLocalStorage({
    key: STORAGE_KEYS.ttsCat,
    defaultValue: defaultConfig,
    getInitialValueInEffect: false,
  });
  const [aiConfig, setAiConfig] = useLocalStorage({
    key: STORAGE_KEYS.ttsCatAiChat,
    defaultValue: defaultAiConfig,
    getInitialValueInEffect: false,
  });

  useEffect(() => {
    const handleConfigChange = () => {
      setTextConfig(textConfigStorage.get());
      setAiConfig(aiConfigStorage.get());
    };
    window.addEventListener('storage', handleConfigChange);

    return () => {
      window.removeEventListener('storage', handleConfigChange);
    };
  }, [setAiConfig, setTextConfig]);

  const handleEdit = () => {
    openSubWindow('/window/ttsCatEditor', {
      title: 'TTSCat edit',
      initialData: {
        textConfig,
        aiConfig,
      },
    });
  };

  const handleEditInterceptor = () => {
    openSubWindow('/window/codeEditor', {
      title: 'TTSCat edit',
      width: 600,
      initialData: {
        content: 'console.log("hello world")',
      },
    });
  };

  const handleReset = () => {
    if (confirm('Reset to default value ?')) {
      setTextConfig(defaultConfig);
      setAiConfig(defaultAiConfig);
    }
  };

  return (
    <Stack spacing='md'>
      <Display textConfig={textConfig} aiChatConfig={aiConfig} />
      <Group position='right' spacing='sm'>
        <Button variant='default' size='xs' onClick={handleEditInterceptor}>
          Edit interceptor
        </Button>
        <Button variant='default' size='xs' onClick={handleReset}>
          Reset
        </Button>
        <Button variant='default' size='xs' onClick={handleEdit}>
          Edit
        </Button>
      </Group>
    </Stack>
  );
};

TTSCat.displayName = 'TTS Cat';

export default TTSCat;
