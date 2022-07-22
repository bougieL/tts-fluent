import { Stack } from '@fluentui/react';
import { IpcEvents } from 'const';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { useAudio } from 'renderer/hooks';
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
  const audio = useAudio();
  const handlePlayClick = async () => {
    setLoading(true);
    try {
      const { src } = await ipcRenderer.invoke(
        IpcEvents.ttsMicrosoftPlay,
        ssml
      );
      audio.setSource(src);
      audio.play();
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
    await ipcRenderer.invoke(IpcEvents.ttsMicrosoftDownload, ssml);
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
        onPlayClick={handlePlayClick}
        onDownloadClick={handleDownloadClick}
        disabled={empty || loading}
        loading={loading}
      />
    </Stack>
  );
};

export default MicrosoftTTS;
