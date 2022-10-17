import { Stack } from 'renderer/components';
import { useState } from 'react';
import { useFn } from 'renderer/hooks';
import { Inputs } from './Inputs';
import { Options, SsmlConfig } from '../MicrosoftTTS/Options';

const defaultConfig: SsmlConfig = {
  locale: 'Chinese (Mandarin, Simplified)',
  voice: 'zh-CN-XiaoxiaoNeural',
  rate: '0%',
  pitch: '0%',
  style: 'general',
  outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
};

const configCacheKey = 'tts_cat';

const configCache = {
  set(config: SsmlConfig) {
    localStorage.setItem(configCacheKey, JSON.stringify(config));
  },
  get(): SsmlConfig {
    try {
      const config = JSON.parse(localStorage.getItem(configCacheKey) || '');
      return config || defaultConfig;
    } catch (error) {
      return defaultConfig;
    }
  },
};

const TTSCat = () => {
  const [config, setConfig] = useState(configCache.get());
  const handleConfigChange = useFn((config: SsmlConfig) => {
    setConfig(config);
    configCache.set(config);
  });

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { height: '100%' } }}>
      <Inputs ssmlConfig={config} />
      <Options value={config} onChange={handleConfigChange} />
    </Stack>
  );
};

export default TTSCat;
