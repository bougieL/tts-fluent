import { DownloadsCache } from 'caches';
import { useState } from 'react';
import fs from 'fs-extra';
import { ipcRenderer, shell } from 'electron';
import { IpcEvents } from 'const';
import { useAsync } from './external';

function useDownloadsStatusChange() {
  useAsync(async () => {
    ipcRenderer.on(
      IpcEvents.downloadsStatusChange,
      (_, { status, payload }) => {
        switch (status) {
          case DownloadsCache.Status.finished:
            new Notification('Download succeed 😄', {
              body: `Click to show item in explorer`,
            }).onclick = () => {
              shell.showItemInFolder(payload);
            };
            break;
          case DownloadsCache.Status.error:
            new Notification('Download failed 😭', {
              body: `Click to show error message`,
            }).onclick = () => {
              alert(payload);
              // clipboard.writeText(payload);
            };
            break;
          default:
            break;
        }
      }
    );
  }, []);
}

export function useDownloadsNum() {
  useDownloadsStatusChange();
  const [num, setNum] = useState(0);
  useAsync(async () => {
    const p = await DownloadsCache.getCachePath();
    const updater = async () => {
      const list = await DownloadsCache.getList();
      setNum(
        list.filter((item) => item.status === DownloadsCache.Status.downloading)
          .length
      );
    };
    const watcher = fs.watch(p, updater);
    return watcher.close;
  }, []);

  return num;
}
