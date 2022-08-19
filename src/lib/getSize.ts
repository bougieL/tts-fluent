import path from 'path';
import fs from 'fs-extra';
import { humanFileSize } from './humanFileSize';


export async function getSize(p: string) {
  let size = 0;

  async function iterate(p: string): Promise<void> {
    const exists = await fs.pathExists(p);
    if (!exists) {
      return;
    }
    const stat = await fs.stat(p);
    if (stat.isDirectory()) {
      const items = await fs.readdir(p);
      await Promise.all(items.map((item) => iterate(path.join(p, item))));
    } else {
      size += stat.size;
    }
  }

  await iterate(p);

  return humanFileSize(size);
}

// getDirSize('./').then(console.log)
