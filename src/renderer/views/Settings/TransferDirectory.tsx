import { TextField } from 'renderer/components';
import { ConfigCache } from 'caches';
import { IpcEvents } from 'const';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import { useAsync } from 'renderer/hooks';

const TransferDirectory = () => {
  const [path, setPath] = useState('');
  const handleSetFilePath = async () => {
    const { filePaths } = await ipcRenderer.invoke(
      IpcEvents.electronDialogShowOpenDialog,
      {
        properties: ['openDirectory'],
      }
    );
    if (filePaths?.[0]) {
      setPath(filePaths[0]);
      await ConfigCache.writeConfig(
        ConfigCache.ConfigKey.transferDir,
        filePaths[0]
      );
    }
  };
  useAsync(async () => {
    const transferDir = await ConfigCache.getTransferDir();
    setPath(transferDir);
  }, []);
  return (
    <TextField
      label="Transfer files directory"
      type="button"
      value={path}
      onClick={handleSetFilePath}
      style={{ textAlign: 'left' }}
    />
  );
};

export default TransferDirectory;
