import { FC, useState } from 'react';
import { ipcRenderer } from 'electron';
import { Stack } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import fs from 'fs-extra';
import * as uuid from 'uuid';

import { IpcEvents } from 'const';
import { useGetAudio } from 'renderer/hooks';
import { IpcEventStream } from 'renderer/lib/EventStream';
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

function handlePlayError(error: any) {
  console.error(error);
  new Notification('Play failed 😭', {
    body: `Click to show error message`,
  }).onclick = () => {
    alert(String(error));
  };
}

const MicrosoftTTS: FC = () => {
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ssml, setSsml] = useState('');
  const [config, setConfig] = useLocalStorage({
    key: STORAGE_KEYS.micorsoftTts,
    defaultValue: defaultConfig,
    getInitialValueInEffect: false,
  });
  const getAudio = useGetAudio();

  const handlePlayClick = async () => {
    setLoading(true);
    try {
      const sessionId = uuid.v4();
      const src = await ipcRenderer.invoke(IpcEvents.ttsMicrosoftPlayStream, {
        ssml,
        sessionId,
      });
      const audio = getAudio();
      if (src) {
        const readStream = fs.createReadStream(src);
        readStream.pipe(audio);
        audio.play();
      } else {
        const channel = `${IpcEvents.ttsMicrosoftPlayStream}-${sessionId}`;
        const ipcEventStream = new IpcEventStream(channel);
        ipcEventStream.on('error', handlePlayError);
        ipcEventStream.pipe(audio);
        audio.play();
      }
    } catch (error) {
      handlePlayError(error);
    }
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
