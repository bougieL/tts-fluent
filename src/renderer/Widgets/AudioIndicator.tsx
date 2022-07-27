import { IconButton, TooltipHost } from '@fluentui/react';
import { useLayoutEffect, useState } from 'react';
import { useAudio } from 'renderer/hooks';
import { AudioStatus } from 'renderer/lib/Audio/types';

export function AudioIndicator() {
  const { audio, streamAudio, isStreamAudio } = useAudio();
  const [status, setStatus] = useState(AudioStatus.empty);
  const currentAudio = isStreamAudio ? streamAudio : audio;
  useLayoutEffect(() => {
    if (isStreamAudio) {
      audio.stop();
    } else {
      streamAudio.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreamAudio]);

  useLayoutEffect(() => {
    const s = currentAudio.addStatusChangeListener((status) => {
      setStatus(status);
    });
    return s.remove;
  }, [currentAudio]);

  const handleClick = () => {
    if (status !== AudioStatus.playing) {
      currentAudio.play();
    } else {
      currentAudio.stop();
    }
  };

  if (status === AudioStatus.empty) {
    return null;
  }

  return (
    <TooltipHost
      content={status === AudioStatus.stopped ? 'Play' : 'Stop'}
      setAriaDescribedBy={false}
    >
      <IconButton
        onClick={handleClick}
        iconProps={{
          iconName: status === AudioStatus.stopped ? 'Play' : 'Stop',
          styles: { root: { fontSize: 24 } },
        }}
        size={24}
      />
    </TooltipHost>
  );
}
