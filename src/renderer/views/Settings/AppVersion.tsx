import { TextInput } from '@mantine/core';

import { useVersion } from 'renderer/hooks';

const AppVersion = () => {
  const { localVersion } = useVersion();

  return (
    <TextInput
      label='Version'
      readOnly
      value={localVersion}
      // style={{ textAlign: 'left' }}
    />
  );
};

export default AppVersion;
