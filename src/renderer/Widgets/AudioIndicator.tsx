import { IconButton, TooltipHost } from '@fluentui/react';
import { useState } from 'react';
import { useAudio, useAsync } from 'renderer/hooks';
import { AudioStatus } from 'renderer/lib/Audio/types';

export function AudioIndicator() {
  const audio = useAudio();
  const [status, setStatus] = useState(AudioStatus.empty);

  useAsync(async () => {
    const subscription = audio.addStatusChangeListener(setStatus);

    return subscription.remove;
  }, []);

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
