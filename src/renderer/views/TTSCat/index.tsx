import { useState } from 'react';

import { PrimaryButton, Stack } from 'renderer/components';
import { useFn } from 'renderer/hooks';
import { createStorage, openWindow } from 'renderer/lib';

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

const TTSCat = () => {
  const [textConfig, setTextConfig] = useState(textConfigStorage.get());
  const handleTextConfigChange = useFn((config: SsmlConfig) => {
    setTextConfig(config);
    textConfigStorage.set(config);
  });

  const handleEdit = () => {
    openWindow('/window/ttsCatEditor', {
      title: 'TTSCat edit',
      width: 600,
      textConfig,
      onTextConfigChange: handleTextConfigChange,
    });
  };

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { height: '100%' } }}>
      <Display ssmlConfig={textConfig} />
      <Stack horizontalAlign="end">
        <PrimaryButton onClick={handleEdit}>Edit</PrimaryButton>
      </Stack>
      {/* <SsmlDistributor value={config} onChange={handleConfigChange} /> */}
    </Stack>
  );
};

export default TTSCat;
