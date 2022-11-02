import { TextInput } from 'renderer/components';

import { version } from '../../../../release/app/package.json';

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
