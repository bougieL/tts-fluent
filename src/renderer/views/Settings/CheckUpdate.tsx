import { shell } from 'electron';

import { isProd } from 'lib/env';
import { CompoundButton, Group, Input } from 'renderer/components';
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
        <CompoundButton
          primary
          secondaryText={`Click here update to ${remoteVersion}`}
          onClick={() => {
            shell.openExternal(
              'https://github.com/bougieL/tts-fluent/releases'
            );
          }}
          styles={{ label: { fontSize: 18 } }}
        >
          🤡 Download 🤡
        </CompoundButton>
        <CompoundButton
          secondaryText='Click here to view change log'
          onClick={() => {
            openSubWindow('/window/markdown', {
              title: 'Change log',
              content: changeLog,
            });
          }}
          styles={{ label: { fontSize: 18 } }}
        >
          Change log
        </CompoundButton>
      </Group>
    </Input.Wrapper>
  );
};

export default CheckUpdate;
