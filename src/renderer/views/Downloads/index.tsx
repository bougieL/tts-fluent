import { FC, useMemo, useRef, useState } from 'react';
import { useAsync } from 'react-use';
import { ssmlToText } from '@bougiel/tts-node';
import { Group, Input, List, Stack, Switch, TextInput } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons';
import fs from 'fs-extra';

import { DownloadsCache } from 'caches';
import { STORAGE_KEYS } from 'renderer/lib/storage';

import { Cell, Item } from './Cell';

import './style.scss';

const globalState = {
  filter: '',
};

const Downloads: FC = () => {
  const [list, setList] = useState<Item[]>([]);

  const [filterReg, setFilterReg] = useState<RegExp>(
    new RegExp(globalState.filter.split(/\s+/).join('.*'))
  );

  const [filter, setFilter] = useState(globalState.filter);

  const [expand, setExpand] = useLocalStorage({
    key: STORAGE_KEYS.downloadExpand,
    defaultValue: false,
    getInitialValueInEffect: false,
  });

  useAsync(async () => {
    const p = await DownloadsCache.getCachePath();
    const updater = async () => {
      const data = await DownloadsCache.getList();
      const list = data
        .map((item) => ({ ...item, text: ssmlToText(item.content).trim() }))
        .sort((a, b) => b.date - a.date);
      setList(list);
    };
    const watcher = fs.watch(p, updater);
    updater();
    return watcher.close;
  }, []);

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleFilterChange = (value: string) => {
    setFilter(value);
    globalState.filter = value;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const v = value.trim();
      setFilterReg(new RegExp(v.split(/\s+/).join('.*')));
    }, 500);
  };

  const filteredList = useMemo(() => {
    return filterReg
      ? list.filter((item) => filterReg.test(item.content))
      : list;
  }, [filterReg, list]);

  return (
    <Stack>
      <Input.Wrapper label='Search content'>
        <Group position='apart'>
          <TextInput
            value={filter}
            onChange={(event) => handleFilterChange(event.target.value)}
            placeholder='Type some keywords here (use blank space separate) ...'
            icon={<IconSearch size={14} />}
            style={{ flex: 1 }}
          />
          <Switch
            label='Expand'
            checked={expand}
            onChange={(event) => {
              const { checked } = event.target;
              setExpand(checked);
            }}
            style={{ display: 'flex' }}
          />
        </Group>
      </Input.Wrapper>
      <List
        listStyleType='none'
        spacing='md'
        style={{
          height: 'calc(100vh - 174px)',
          overflow: 'overlay',
        }}
        styles={{ itemWrapper: { width: '100%' } }}
      >
        {filteredList.map((item) => {
          return <Cell key={item.id} item={item!} expand={expand} />;
        })}
      </List>
    </Stack>
  );
};

Downloads.displayName = 'Downloads';

export default Downloads;
