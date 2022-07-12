import { Stack } from '@fluentui/react';
import { ipcRenderer, shell } from 'electron';
import { useEffect, useRef, useState } from 'react';
import { useFn } from '../../hooks';
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
  const base64Ref = useRef('');
  const [config, setConfig] = useState(defaultConfig);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const handlePlayClick = useFn(async () => {
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      return;
    }
    if (!base64Ref.current) {
      setLoading(true);
      const data = await ipcRenderer.invoke('tts.microsoft.ssmlToBuffer', ssml);
      setLoading(false);
      const blob = new Blob([data], { type: 'audio/mp3' });
      const url = window.URL.createObjectURL(blob);
      base64Ref.current = url;
    }
    audioRef.current.src = base64Ref.current;
    audioRef.current.play();
  });
  const handleDownloadClick = useFn(async () => {
    setLoading(true);
    const p = await ipcRenderer.invoke('tts.microsoft.download', ssml);
    setLoading(false);
    new Notification('Save successfully!', {
      body: `Successfully saved to ${p}`,
    }).onclick = () => {
      shell.showItemInFolder(p);
    };
  });
  useEffect(() => {
    const handleEnd = () => {
      setPlaying(false);
    };
    const handlePlay = () => {
      setPlaying(true);
    };
    const audio = audioRef.current;
    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handleEnd);
    return () => {
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handleEnd);
    };
  }, []);
  return (
    <Stack tokens={{ childrenGap: 18 }} styles={{ root: { height: '100%' } }}>
      <Inputs
        ssmlConfig={config}
        onChange={(nssml, empty) => {
          if (nssml !== ssml) {
            base64Ref.current = '';
            setSsml(nssml);
            setEmpty(empty);
          }
        }}
      />
      <Options onChange={setConfig} />
      <Buttons
        onPlayClick={handlePlayClick}
        onDownloadClick={handleDownloadClick}
        playing={playing}
        disabled={empty || loading}
        loading={loading}
      />
    </Stack>
  );
};

export default MicrosoftTTS;
