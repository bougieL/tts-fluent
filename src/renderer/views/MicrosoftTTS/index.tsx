import { Stack } from '@fluentui/react';
import { PlayCache } from 'caches';
import { ipcRenderer, shell } from 'electron';
import { useState } from 'react';
import { useAudio, useFn } from '../../hooks';
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
  const handlePlayClick = useFn(async () => {
    setLoading(true);
    const { src, hash } = await ipcRenderer.invoke('tts.microsoft.play', ssml);
    // console.log(res, typeof res)
    // console.log(src, hash)
    audio.setSource(src, {
      getStreamEnd: async () => {
        return PlayCache.getFinished(hash);
      },
    });
    audio.play();
    setLoading(false);
  });
  const handleDownloadClick = useFn(async () => {
    const p = await ipcRenderer.invoke('tts.microsoft.download', ssml);
    new Notification('Save successfully!', {
      body: `Successfully saved to ${p}`,
    }).onclick = () => {
      shell.showItemInFolder(p);
    };
  });
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
