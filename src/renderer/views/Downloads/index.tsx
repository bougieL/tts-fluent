import { FC, useMemo, useRef, useState } from 'react';
import { ssmlToText } from '@bougiel/tts-node/lib/ssml/index';
import fs from 'fs-extra';

import { DownloadsCache } from 'caches';
import { List, Stack, TextInput } from 'renderer/components';
import { useAsync } from 'renderer/hooks';

import { Cell, Item } from './Cell';

const globalState = {
  filter: '',
};

const Downloads: FC = () => {
  const [list, setList] = useState<Item[]>([]);

  const [filterReg, setFilterReg] = useState<RegExp>(
    new RegExp(globalState.filter.split(/\s+/).join('.*'))
  );

  const [filter, setFilter] = useState(globalState.filter);

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
      <TextInput
        label='Search content'
        value={filter}
        onChange={(event) => handleFilterChange(event.target.value)}
        placeholder='Type some keywords here (use blank space separate) ...'
      />
      <List
        listStyleType='none'
        spacing='md'
        style={{
          height: 'calc(100vh - 142px)',
          overflow: 'overlay',
        }}
        styles={{ itemWrapper: { width: '100%' } }}
      >
        {filteredList.map((item) => {
          return <Cell key={item.id} item={item!} />;
        })}
      </List>
    </Stack>
  );
};

Downloads.displayName = 'Downloads';

export default Downloads;
