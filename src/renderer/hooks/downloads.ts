import { DownloadsCache } from 'caches';
import { useState } from 'react';
import { useAsync } from 'react-use';
import fs from 'fs-extra';

export function useDownloadsNum() {
  const [num, setNum] = useState(0);
  useAsync(async () => {
    const p = await DownloadsCache.getCachePath();
    const updater = async () => {
      const list = await DownloadsCache.getList();
      setNum(list.filter((item) => item.downloading).length);
    };
    const watcher = fs.watch(p, updater);

    return watcher.close;
  }, []);

  return num;
}
