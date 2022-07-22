import path from 'path';
import fs from 'fs-extra';

export function humanFileSize(size: number) {
  if (size === 0) return '0 B';
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
}

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
