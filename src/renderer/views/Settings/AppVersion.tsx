import { TextField } from '@fluentui/react';
import { APP_VERSION } from 'const';

const AppVersion = () => {
  return (
    <TextField
      label="Version"
      readOnly
      value={APP_VERSION}
      style={{ textAlign: 'left' }}
    />
  );
};

export default AppVersion;
