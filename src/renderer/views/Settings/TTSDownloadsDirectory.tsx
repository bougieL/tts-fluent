import { useState } from 'react';
import { useAsync } from 'react-use';
import { ipcRenderer } from 'electron';
import { TextInput } from '@mantine/core';
import { IconFolder } from '@tabler/icons';

import { ConfigCache } from 'caches';
import { IpcEvents } from 'const';

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
      await ConfigCache.write(ConfigCache.Key.downloadsDir, filePaths[0]);
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
      icon={<IconFolder size={14} />}
      style={{ textAlign: 'left' }}
    />
  );
};

export default TTSDownloadsDirectory;
