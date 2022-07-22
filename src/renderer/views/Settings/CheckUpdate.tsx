import { CompoundButton, Label, Stack } from '@fluentui/react';
import { shell } from 'electron';
import { useVersion } from 'renderer/hooks';

const CheckUpdate = () => {
  const { hasUpdate, remoteVersion } = useVersion();

  if (!hasUpdate) {
    return null;
  }
  return (
    <>
      <Label>New version!</Label>
      <Stack
        horizontal
        horizontalAlign="start"
        tokens={{ childrenGap: 12 }}
        styles={{ root: { marginTop: '0 !important' } }}
      >
        <CompoundButton
          primary
          secondaryText="Experience latest feature"
          onClick={() => {
            shell.openExternal('https://github.com');
          }}
        >
          Download {remoteVersion} in github
        </CompoundButton>
      </Stack>
    </>
  );
};

export default CheckUpdate;
