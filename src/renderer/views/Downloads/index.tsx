import {
  FocusZone,
  FocusZoneDirection,
  List,
  Stack,
  TextField,
} from '@fluentui/react';
import { useMemo, useRef, useState } from 'react';
import { useAsync } from 'renderer/hooks';
import { DownloadsCache } from 'caches';
import { ssmlToText } from '@bougiel/tts-node/lib/ssml/index';
import fs from 'fs-extra';
import { Cell, Item } from './Cell';

const globalState = {
  filter: '',
};

function Downloads() {
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
    <FocusZone direction={FocusZoneDirection.vertical}>
      <TextField
        label="Search content"
        value={filter}
        onChange={(_, value) => handleFilterChange(value!)}
        placeholder="Type some keywords here (use blank space separate) ..."
      />
      <Stack
        styles={{ root: { height: 'calc(100vh - 160px)', overflow: 'auto' } }}
      >
        <List
          items={filteredList}
          getKey={(item) => item.id}
          onRenderCell={(item) => {
            return <Cell key={item?.id} item={item!} />;
          }}
        />
      </Stack>
    </FocusZone>
  );
}

export default Downloads;
