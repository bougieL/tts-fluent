import { TextField } from '@fluentui/react';
import { IpcEvents } from 'const';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { useAsync } from 'renderer/hooks';

const AppVersion = () => {
  const [version, setVersion] = useState('');
  useAsync(async () => {
    const version = await ipcRenderer.invoke(IpcEvents.electronAppGetVersion);
    setVersion(version);
  }, []);
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
