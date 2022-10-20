import path from 'path';

import fs from 'fs-extra';

import { getCachesDir } from './_utils';

export namespace DownloadsCache {
  export const getCachePath = async () => {
    const p = path.join(await getCachesDir(), 'downloads.json');
    await fs.ensureFile(p);
    return p;
  };

  export enum Status {
    error = -1,
    finished = 0,
    downloading = 1,
  }

  export interface Item {
    id: string;
    content: string;
    date: number;
    md5: string;
    path: string;
    status: Status;
    errorMessage?: string;
  }

  export async function getList(): Promise<Item[]> {
    try {
      const cachePath = await getCachePath();
      const content = await fs.readFile(cachePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch (error) {
      return [];
    }
  }

  export async function addItem(item: Item) {
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
    } catch (error) {}
  }

  export async function updateItem(id: string, data: Partial<Item>) {
    try {
      const cachePath = await getCachePath();
      const list = await getList();
      const index = list.findIndex((item) => item.id === id);
      if (index > -1) {
        list[index] = { ...list[index], ...data };
      }
      await fs.writeFile(cachePath, JSON.stringify(list));
    } catch (error) {}
  }

  export async function updateBatches(
    items: Array<{ id: string; data: Partial<Item> }>
  ) {
    try {
      const cachePath = await getCachePath();
      const list = await getList();
      items.forEach(({ id, data }) => {
        const index = list.findIndex((item) => item.id === id);
        if (index > -1) {
          list[index] = { ...list[index], ...data };
        }
      });
      await fs.writeFile(cachePath, JSON.stringify(list));
    } catch (error) {}
  }

  export async function getItemByHash(hash: string) {
    const list = await getList();
    return list.find((item) => item.md5 === hash);
  }
}
