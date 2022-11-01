import { shell } from 'electron';

import { isProd } from 'lib/env';
import { CompoundButton, FStack, Label } from 'renderer/components';
import { useVersion } from 'renderer/hooks';
import { openSubWindow } from 'renderer/lib';

const CheckUpdate = () => {
  const { hasUpdate, remoteVersion, changeLog } = useVersion();

  if (!hasUpdate && isProd) {
    return null;
  }
  return (
    <>
      <Label>New version! {isProd ? '' : `hasUpdate = ${hasUpdate}`}</Label>
      <FStack
        horizontal
        horizontalAlign='start'
        tokens={{ childrenGap: 12 }}
        styles={{ root: { marginTop: '0 !important' } }}
      >
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
      </FStack>
    </>
  );
};

export default CheckUpdate;
