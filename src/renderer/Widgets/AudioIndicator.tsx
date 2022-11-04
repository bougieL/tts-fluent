import { useLayoutEffect, useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';

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
    <Tooltip label={status === AudioStatus.stopped ? 'Play' : 'Stop'}>
      <ActionIcon onClick={handleClick} color='indigo'>
        {status === AudioStatus.stopped ? (
          <IconPlayerPlay />
        ) : (
          <IconPlayerStop />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
