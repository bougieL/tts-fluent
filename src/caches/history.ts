import fs from 'fs-extra';
import path from 'path';
import { getCachesDir } from './_utils';

export namespace HistoryCache {
  const getCachePath = async () =>
    path.join(await getCachesDir(), 'history.json');

  export interface Item {
    id: string;
    content: string;
    date: number;
    path: string;
  }

  export async function getList() {
    const cachePath = await getCachePath();
    fs.ensureFileSync(cachePath);
    let value: Item[] = [];
    try {
      const content = await fs.readFile(cachePath, 'utf-8');
      value = JSON.parse(content);
    } catch (error) {}
    return value;
  }

  export async function addItem(item: Item) {
    const cachePath = await getCachePath();
    const value = await getList();
    value.push(item);
    fs.writeFileSync(cachePath, JSON.stringify(value));
  }

  export async function removeItem(id: string) {
    const cachePath = await getCachePath();
    let value = await getList();
    value = value.filter((item) => item.id !== id);
    fs.writeFileSync(cachePath, JSON.stringify(value));
  }
}
