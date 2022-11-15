import { FC, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Space, Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import * as uuid from 'uuid';

import { IpcEvents } from 'const';
import { useAudio } from 'renderer/hooks';
import { STORAGE_KEYS } from 'renderer/lib/storage';

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

const MicrosoftTTS: FC = () => {
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ssml, setSsml] = useState('');
  const [config, setConfig] = useLocalStorage({
    key: STORAGE_KEYS.micorsoftTts,
    defaultValue: defaultConfig,
    getInitialValueInEffect: false,
  });
  const { audio, streamAudio, setIsStreamAudio, resetAudio } = useAudio();

  const handlePlayStream = async (sessionId: string) => {
    setIsStreamAudio(true);
    const channel = `${IpcEvents.ttsMicrosoftPlayStream}-${sessionId}`;
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
  };

  const handlePlayClick = async () => {
    resetAudio();
    setLoading(true);
    const sessionId = uuid.v4();
    const src = await ipcRenderer
      .invoke(IpcEvents.ttsMicrosoftPlayStream, {
        ssml,
        sessionId,
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
    await handlePlayStream(sessionId);
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

  return (
    <Stack spacing='lg'>
      <Inputs
        ssmlConfig={config}
        onChange={(nssml, empty) => {
          if (nssml !== ssml) {
            setSsml(nssml);
            setEmpty(empty);
          }
        }}
      />
      <SsmlDistributor value={config} onChange={setConfig} />
      <Buttons
        onPlayClick={handlePlayClick}
        onDownloadClick={handleDownloadClick}
        onResetClick={() => {
          setConfig(defaultConfig);
        }}
        disabled={empty || loading}
        loading={loading}
      />
    </Stack>
  );
};

MicrosoftTTS.displayName = 'Microsoft TTS';

export default MicrosoftTTS;
