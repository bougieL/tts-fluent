import { useRef, useState } from 'react';
import { shell } from 'electron';
import fs from 'fs-extra';

import { PlayCache } from 'caches';
import { getSize } from 'lib/getSize';
import { Button, Grid, Label, Space } from 'renderer/components';
import { useAsync } from 'renderer/hooks';

const ManagePlayCache = () => {
  const cachePathRef = useRef('');
  const [size, setSize] = useState('0 B');
  const handleClearCache = async () => {
    const sure = confirm(
      'Are you sure to clear cache? This operation can not revoke'
    );
    const cachePath = await PlayCache.getCachePath();
    if (sure) {
      await fs.remove(cachePath);
      await updateSize();
    }
  };
  const handleOpenCache = async () => {
    await fs.ensureDir(cachePathRef.current);
    shell.showItemInFolder(cachePathRef.current);
  };
  const updateSize = async () => {
    await fs.ensureDir(cachePathRef.current);
    const size = await getSize(cachePathRef.current);
    setSize(size);
  };
  useAsync(async () => {
    const cachePath = await PlayCache.getCachePath();
    cachePathRef.current = cachePath;
    await updateSize();
    const watcher = fs.watch(cachePath, updateSize);
    return watcher.close;
  }, []);
  return (
    <>
      <Label>Manage play cache</Label>
      <Grid>
        <Button onClick={handleClearCache}>Clear cache ({size})</Button>
        <Space w="xs" />
        <Button onClick={handleOpenCache}>Open cache directory</Button>
      </Grid>
    </>
  );
};

export default ManagePlayCache;
