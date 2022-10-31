import { useState } from 'react';
import { ipcRenderer } from 'electron';
import * as uuid from 'uuid';

import { IpcEvents } from 'const';
import { FStack } from 'renderer/components';
import { useAudio, useFn } from 'renderer/hooks';
import { createStorage } from 'renderer/lib';

import { Buttons } from './Buttons';
import { Inputs } from './Inputs';
import { SsmlConfig, SsmlDistributor } from './SsmlDistributor';

const defaultConfig: SsmlConfig = {
  locale: 'Chinese (Mandarin, Simplified)',
  voice: 'zh-CN-XiaoxiaoNeural',
  rate: '0%',
  pitch: '0%',
  style: 'general',
  outputFormat: 'audio-24khz-96kbitrate-mono-mp3',
};

const configStorage = createStorage('microsoft_tts', defaultConfig);

const MicrosoftTTS = () => {
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ssml, setSsml] = useState('');
  const [config, setConfig] = useState(configStorage.get());
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
    configStorage.set(config);
  });

  return (
    <FStack tokens={{ childrenGap: 24 }} styles={{ root: { height: '100%' } }}>
      <Inputs
        ssmlConfig={config}
        onChange={(nssml, empty) => {
          if (nssml !== ssml) {
            setSsml(nssml);
            setEmpty(empty);
          }
        }}
      />
      <SsmlDistributor value={config} onChange={handleConfigChange} />
      <Buttons
        onPlayClick={handlePlayStream}
        onDownloadClick={handleDownloadClick}
        disabled={empty || loading}
        loading={loading}
      />
    </FStack>
  );
};

export default MicrosoftTTS;
