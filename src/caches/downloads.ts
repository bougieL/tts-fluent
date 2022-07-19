import fs from 'fs-extra';
import path from 'path';
import { getCachesDir } from './_utils';

export namespace DownloadsCache {
  export const getCachePath = async () => {
    const p = path.join(await getCachesDir(), 'history.json');
    await fs.ensureFile(p);
    return p;
  };

  export interface Item {
    id: string;
    content: string;
    date: number;
    md5: string;
    path: string;
    downloading: boolean;
  }

  const streamMap: Record<string, fs.WriteStream> = {};

  export async function getList(): Promise<Item[]> {
    try {
      const cachePath = await getCachePath();
      const content = await fs.readFile(cachePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (error) {
      return [];
    }
  }

  export async function addItem(item: Item, stream?: fs.WriteStream) {
    try {
      const cachePath = await getCachePath();
      const list = await getList();
      const index = list.findIndex((a) => a.id === item.id);
      if (index > -1) {
        list[index] = item;
      } else {
        list.push(item);
      }
      await fs.writeFile(cachePath, JSON.stringify(list));
      if (stream) {
        streamMap[item.id] = stream;
      }
    } catch (error) {
      // console.error(error);
    }
  }

  export async function removeItem(id: string) {
    try {
      const cachePath = await getCachePath();
      let list = await getList();
      list = list.filter((item) => item.id !== id);
      await fs.writeFile(cachePath, JSON.stringify(list));
      streamMap[id]?.close();
    } catch (error) {}
  }
}
