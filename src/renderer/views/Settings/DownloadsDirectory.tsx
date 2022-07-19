import { TextField } from '@fluentui/react';
import { ConfigCache } from 'caches';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { useAsync } from 'react-use';

const DownloadsDirectory = () => {
  const [path, setPath] = useState('');
  const handleSetFilePath = async () => {
    const paths = await ipcRenderer.invoke(
      'electron.dialog.showOpenDialogSync',
      {
        properties: ['openDirectory'],
      }
    );
    if (paths?.[0]) {
      setPath(paths[0]);
      await ConfigCache.writeConfig(
        ConfigCache.ConfigKey.downloadsDir,
        paths[0]
      );
    }
  };
  useAsync(async () => {
    const downloadsDir = await ConfigCache.getDownloadsDir();
    setPath(downloadsDir);
  }, []);
  return (
    <TextField
      label="Downloads directory"
      type="button"
      value={path}
      onClick={handleSetFilePath}
      style={{ textAlign: 'left' }}
    />
  );
};

export default DownloadsDirectory;
