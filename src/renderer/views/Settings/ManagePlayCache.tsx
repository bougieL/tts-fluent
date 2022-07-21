import { DefaultButton, Label, Stack } from '@fluentui/react';
import { PlayCache } from 'caches';
import { shell } from 'electron';
import { useRef, useState } from 'react';
import { useAsync } from 'renderer/hooks';
import fs from 'fs-extra';
import { getSize } from 'lib/getSize';

const ManagePlayCache = () => {
  const cacheDirRef = useRef('');
  const [size, setSize] = useState('0 B');
  const handleClearCache = async () => {
    const sure = confirm(
      'Are you sure to clear cache? This operation can not revoke'
    );
    if (sure) {
      fs.remove(cacheDirRef.current);
    }
  };
  const handleOpenCache = () => {
    shell.showItemInFolder(cacheDirRef.current);
  };
  useAsync(async () => {
    const cacheDir = await PlayCache.getCachePath();
    await fs.ensureDir(cacheDir);
    cacheDirRef.current = cacheDir;
    const size = await getSize(cacheDir);
    setSize(size);
    const watcher = fs.watch(cacheDir, { recursive: true }, async () => {
      const size = await getSize(cacheDir);
      setSize(size);
    });
    return watcher.close;
  }, []);
  return (
    <>
      <Label>Manage play cache</Label>
      <Stack
        horizontal
        horizontalAlign="start"
        tokens={{ childrenGap: 12 }}
        styles={{ root: { marginTop: '0 !important' } }}
      >
        <DefaultButton onClick={handleClearCache}>
          Clear cache ({size})
        </DefaultButton>
        <DefaultButton onClick={handleOpenCache}>
          Open cache directory
        </DefaultButton>
      </Stack>
    </>
  );
};

export default ManagePlayCache;
