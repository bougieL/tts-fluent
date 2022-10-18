import { Stack } from 'renderer/components';
import { IpcEvents } from 'const';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { useAudio, useFn } from 'renderer/hooks';
import * as uuid from 'uuid';
import { Buttons } from './Buttons';
import { Inputs } from './Inputs';
import { Options, SsmlConfig } from './Options';

const defaultConfig: SsmlConfig = {
  locale: 'Chinese (Mandarin, Simplified)',
  voice: 'zh-CN-XiaoxiaoNeural',
  rate: '0%',
  pitch: '0%',
  style: 'general',
  outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
};

const configCacheKey = 'microsoft_tts';

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

const MicrosoftTTS = () => {
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ssml, setSsml] = useState('');
  const [config, setConfig] = useState(configCache.get());
  const { audio, streamAudio, setIsStreamAudio } = useAudio();
  const handlePlayStream = async () => {
    setLoading(true);
    const id = uuid.v4();
    const src = await ipcRenderer
      .invoke(IpcEvents.ttsMicrosoftPlayStream, {
        ssml,
        sessionId: id,
      })
      .catch((error) => {
        setLoading(false);
        new Notification('Play failed 😭', {
          body: `Click to show error message`,
        }).onclick = () => {
          alert(String(error));
        };
      });
    if (src) {
      setLoading(false);
      setIsStreamAudio(false);
      audio.setSource(src);
      audio.play();
      return;
    }
    setIsStreamAudio(true);
    streamAudio.reset();
    const channel = `${IpcEvents.ttsMicrosoftPlayStream}-${id}`;
    const streamHandler = (
      _: any,
      { chunk, isEnd, isError, errorMessage }: any
    ) => {
      if (chunk) {
        streamAudio.appendBuffer(chunk);
      }
      if (isEnd || isError) {
        streamAudio.setStreamEnd();
        ipcRenderer.off(channel, streamHandler);
      }
      if (isError && errorMessage) {
        new Notification('Play failed 😭', {
          body: `Click to show error message`,
        }).onclick = () => {
          alert(errorMessage);
        };
      }
    };
    ipcRenderer.on(channel, streamHandler);
    streamAudio.play();
    setLoading(false);
  };
  const handleDownloadClick = async () => {
    setLoading(true);
    await ipcRenderer
      .invoke(IpcEvents.ttsMicrosoftDownload, { ssml })
      .catch((error) => {
        new Notification('Download failed 😭', {
          body: `Click to show error message`,
        }).onclick = () => {
          alert(String(error));
        };
      });
    setLoading(false);
  };
  const handleConfigChange = useFn((config: SsmlConfig) => {
    setConfig(config);
    configCache.set(config);
  });

  return (
    <Stack tokens={{ childrenGap: 24 }} styles={{ root: { height: '100%' } }}>
      <Inputs
        ssmlConfig={config}
        onChange={(nssml, empty) => {
          if (nssml !== ssml) {
            setSsml(nssml);
            setEmpty(empty);
          }
        }}
      />
      <Options value={config} onChange={handleConfigChange} />
      <Buttons
        onPlayClick={handlePlayStream}
        onDownloadClick={handleDownloadClick}
        disabled={empty || loading}
        loading={loading}
      />
    </Stack>
  );
};

export default MicrosoftTTS;
