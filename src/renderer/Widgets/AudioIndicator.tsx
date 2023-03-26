import { useContext, useLayoutEffect, useState } from 'react';
import { ActionIcon, Tooltip, useMantineTheme } from '@mantine/core';
import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';

import { audioContext } from 'renderer/hooks/audio';
import { AudioStatus } from 'renderer/lib/Audio/types';

export function AudioIndicator() {
  const audio = useContext(audioContext);
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

  const { primaryColor } = useMantineTheme();

  if (status === AudioStatus.empty) {
    return null;
  }

  return (
    <Tooltip label={status === AudioStatus.stopped ? 'Play' : 'Stop'}>
      <ActionIcon color={primaryColor} onClick={handleClick}>
        {(() => {
          switch (status) {
            case AudioStatus.stopped:
              return <IconPlayerPlay />;
            default:
              return <IconPlayerStop />;
          }
        })()}
      </ActionIcon>
    </Tooltip>
  );
}
