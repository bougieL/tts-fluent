import { ipcMain } from 'electron';
import fs from 'fs-extra';
import { HistoryCache } from '../caches';

ipcMain.handle('tts.histories.getList', () => {
  return HistoryCache.getList().map((item) => {
    return {
      ...item,
      exists: fs.existsSync(item.path),
    };
  });
});

ipcMain.handle('tts.histories.removeItem', (_, id) => {
  return HistoryCache.removeItem(id);
});

ipcMain.handle('tts.hisotries.playItem', (_, path) => {
  return fs.readFileSync(path);
});
