import { useRef, useState } from 'react';
import { useAsync } from 'react-use';
import { shell } from 'electron';
import { Button, Group, Input, Switch } from '@mantine/core';
import fs from 'fs-extra';

import { ConfigCache, PlayCache } from 'caches';
import { getSize } from 'lib/getSize';

const ManagePlayCache = () => {
  const cachePathRef = useRef('');
  const [size, setSize] = useState('0 B');
  const [disabled, setDisabled] = useState(false);

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
    shell.openPath(cachePathRef.current);
  };
  const updateSize = async () => {
    await fs.ensureDir(cachePathRef.current);
    const size = await getSize(cachePathRef.current);
    setSize(size);
  };
  useAsync(async () => {
    const disabled = await ConfigCache.get(ConfigCache.Key.playCacheDisabled);
    setDisabled(!!disabled);
  }, []);
  useAsync(async () => {
    const cachePath = await PlayCache.getCachePath();
    cachePathRef.current = cachePath;
    await updateSize();
    const watcher = fs.watch(cachePath, updateSize);
    return watcher.close;
  }, []);
  return (
    <Input.Wrapper label='Manage play cache'>
      <Group spacing='xs' align='center'>
        <Button variant='default' size='xs' onClick={handleClearCache}>
          Clear cache ({size})
        </Button>
        <Button variant='default' size='xs' onClick={handleOpenCache}>
          Open cache directory
        </Button>
        <Switch
          checked={disabled}
          label='Disable play cache'
          style={{
            display: 'flex',
          }}
          onChange={(event) => {
            const { checked } = event.target;
            setDisabled(checked);
            ConfigCache.write(ConfigCache.Key.playCacheDisabled, checked);
          }}
        />
      </Group>
    </Input.Wrapper>
  );
};

export default ManagePlayCache;
