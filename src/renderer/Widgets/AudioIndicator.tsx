import { useContext, useLayoutEffect, useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';

import { streamAudioContext } from 'renderer/hooks/audio';
import { AudioStatus } from 'renderer/lib/Audio/types';

export function AudioIndicator() {
  const audio = useContext(streamAudioContext);
  const [status, setStatus] = useState(AudioStatus.empty);

  useLayoutEffect(() => {
    const s = audio.addStatusChangeListener((status) => {
      setStatus(status);
    });
    return s.remove;
  }, [audio]);

  const handleClick = () => {
    if (status !== AudioStatus.playing) {
      audio.play();
    } else {
      audio.stop();
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
