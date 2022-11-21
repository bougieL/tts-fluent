import { TextInput } from '@mantine/core';
import { IconGitMerge } from '@tabler/icons';

import { useVersion } from 'renderer/hooks';

const AppVersion = () => {
  const { localVersion } = useVersion();

  return (
    <TextInput
      label='Version'
      readOnly
      value={localVersion}
      icon={<IconGitMerge size={14} />}
      // style={{ textAlign: 'left' }}
    />
  );
};

export default AppVersion;
