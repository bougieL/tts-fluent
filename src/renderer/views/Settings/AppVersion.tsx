import { TextInput } from '@mantine/core';

import pkg from '../../../../release/app/package.json';

const { version } = pkg;

const AppVersion = () => {
  return (
    <TextInput
      label='Version'
      readOnly
      value={version}
      // style={{ textAlign: 'left' }}
    />
  );
};

export default AppVersion;
