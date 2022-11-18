import { shell } from 'electron';
import { Button, Group, Input } from '@mantine/core';

import { isProd } from 'lib/env';
import { useVersion } from 'renderer/hooks';
import { openSubWindow } from 'renderer/lib';

const CheckUpdate = () => {
  const { hasUpdate, remoteVersion, changeLog } = useVersion();

  if (!hasUpdate && isProd) {
    return null;
  }
  return (
    <Input.Wrapper
      label={`New version! ${isProd ? '' : `hasUpdate = ${hasUpdate}`}`}
    >
      <Group spacing='sm'>
        <Button
          size='xs'
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/releases'
            );
          }}
        >
          🤡 Download {remoteVersion} 🤡
        </Button>
        <Button
          size='xs'
          variant='default'
          onClick={() => {
            openSubWindow('/window/markdown', {
              title: 'Change log',
              initialData: {
                content: changeLog,
              },
            });
          }}
        >
          View change log
        </Button>
      </Group>
    </Input.Wrapper>
  );
};

export default CheckUpdate;
