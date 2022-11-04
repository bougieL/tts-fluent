import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { TextInput } from '@mantine/core';

import { ConfigCache } from 'caches';
import { IpcEvents } from 'const';
import { useAsync } from 'renderer/hooks';

const TTSDownloadsDirectory = () => {
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
        ConfigCache.ConfigKey.downloadsDir,
        filePaths[0]
      );
    }
  };
  useAsync(async () => {
    const downloadsDir = await ConfigCache.getTTSDownloadsDir();
    setPath(downloadsDir);
  }, []);
  return (
    <TextInput
      label='TTS Downloads directory'
      type='button'
      value={path}
      onClick={handleSetFilePath}
      style={{ textAlign: 'left' }}
    />
  );
};

export default TTSDownloadsDirectory;
