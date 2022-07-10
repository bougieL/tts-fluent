import fs from 'fs-extra';
import path from 'path';
import { cachesDir } from './_utils';

export namespace HistoryCache {
  const cachePath = path.join(cachesDir, 'history.json');

  export interface Item {
    id: string;
    content: string;
    date: number;
    path: string;
  }

  export function getList() {
    fs.ensureFileSync(cachePath);
    let value: Item[] = [];
    try {
      const content = fs.readFileSync(cachePath, 'utf-8');
      value = JSON.parse(content);
    } catch (error) {}
    return value;
  }

  export function addItem(item: Item) {
    const value = getList();
    value.push(item);
    fs.writeFileSync(cachePath, JSON.stringify(value));
  }

  export function removeItem(id: string) {
    let value = getList();
    value = value.filter((item) => item.id !== id);
    fs.writeFileSync(cachePath, JSON.stringify(value));
  }
}
