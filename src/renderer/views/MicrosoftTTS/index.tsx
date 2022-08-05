import { Stack } from '@fluentui/react';
import { IpcEvents } from 'const';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { useAudio } from 'renderer/hooks';
import * as uuid from 'uuid';
import { Buttons } from './Buttons';
import { Inputs } from './Inputs';
import { Options, SsmlConfig } from './Options';

const defaultConfig: SsmlConfig = {
  voice: 'zh-CN-XiaoxiaoNeural',
  rate: '0%',
  pitch: '0%',
  style: 'general',
};

const MicrosoftTTS = () => {
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ssml, setSsml] = useState('');
  const [config, setConfig] = useState(defaultConfig);
  const { audio, streamAudio, setIsStreamAudio } = useAudio();
  const handlePlayStream = async () => {
    setLoading(true);
    try {
      const id = uuid.v4();
      const src = await ipcRenderer.invoke(IpcEvents.ttsMicrosoftPlayStream, {
        ssml,
        sessionId: id,
      });
      if (src) {
        setIsStreamAudio(false);
        audio.setSource(src);
        audio.play();
      } else {
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
      }
    } catch (error) {
      new Notification('Play failed 😭', {
        body: `Click to show error message`,
      }).onclick = () => {
        alert(String(error));
      };
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
    <Stack tokens={{ childrenGap: 18 }} styles={{ root: { height: '100%' } }}>
      <Inputs
        ssmlConfig={config}
        onChange={(nssml, empty) => {
          if (nssml !== ssml) {
            setSsml(nssml);
            setEmpty(empty);
          }
        }}
      />
      <Options onChange={setConfig} />
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
