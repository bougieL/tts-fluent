import fs from 'fs-extra';
import path from 'path';

import { getCachesDir } from './_utils';

export namespace PlayCache {
  export const getCachePath = async () => {
    const p = path.join(await getCachesDir(), 'play-cache');
    await fs.ensureDir(p);
    return p;
  };

  export async function setFinished(md5: string) {
    const cachePath = await getCachePath();
    const listPath = path.join(cachePath, 'completed.json');
    await fs.ensureFile(listPath);
    let json: Record<string, boolean> = {};
    try {
      const content = await fs.readFile(listPath, 'utf-8');
      json = JSON.parse(content);
    } catch (error) {}
    json[md5] = true;
    return fs.writeFile(listPath, JSON.stringify(json));
  }

  export async function getFinished(md5: string) {
    const cachePath = await getCachePath();
    const listPath = path.join(cachePath, 'completed.json');
    let json: Record<string, boolean> = {};
    try {
      const content = await fs.readFile(listPath, 'utf-8');
      json = JSON.parse(content);
    } catch (error) {}
    return !!json[md5];
  }

  export async function clear() {
    const cachePath = await getCachePath();
    return fs.remove(cachePath);
  }
}
