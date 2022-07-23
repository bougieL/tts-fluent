import { TextField } from '@fluentui/react';
import { version } from '@app/package.json';

const AppVersion = () => {
  return (
    <TextField
      label="Version"
      readOnly
      value={version}
      style={{ textAlign: 'left' }}
    />
  );
};

export default AppVersion;
