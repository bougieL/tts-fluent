import path from 'path';

import { NativeTheme } from 'electron';
import fs from 'fs-extra';

import { ThemeVariant } from 'const';

import { getCachesDir, getDownloadsDir } from './_utils';

export namespace ConfigCache {
  export enum Key {
    downloadsDir = 'downloadsDir',
    transferDir = 'transferDir',
    theme = 'theme',
    route = 'route',
    playCacheDisabled = 'playCacheDisabled',
  }

  const getConfigPath = async () => {
    const p = path.join(await getCachesDir(), 'config.json');
    await fs.ensureFile(p);
    return p;
  };

  export async function write(key: Key, value: string | number | boolean) {
    const configPath = await getConfigPath();
    let config: any = {};
    try {
      const content = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(content || '{}');
    } catch (error) {}
    config[key] = value;
    try {
      await fs.writeFile(configPath, JSON.stringify(config));
    } catch (error) {}
  }

  export async function get(key: Key) {
    let config: any = {};
    try {
      config = JSON.parse(fs.readFileSync(await getConfigPath(), 'utf-8'));
    } catch (error) {}
    return config[key];
  }

  export async function getTTSDownloadsDir(): Promise<string> {
    const downloadsDir = await getDownloadsDir();
    const configDir = await get(Key.downloadsDir);
    const p = configDir || downloadsDir;
    try {
      await fs.ensureDir(p);
      return p;
    } catch (error) {
      return downloadsDir;
    }
  }

  export async function getTransferDir(): Promise<string> {
    const downloadsDir = await getDownloadsDir();
    const configDir = await get(Key.transferDir);
    const p = configDir || downloadsDir;
    try {
      await fs.ensureDir(p);
      return p;
    } catch (error) {
      return downloadsDir;
    }
  }

  export async function getTheme(): Promise<NativeTheme['themeSource']> {
    const theme = (await get(Key.theme)) || ThemeVariant.system;

    return theme;
  }

  export async function getRoute(): Promise<string> {
    const route = await get(Key.route);

    return route || '';
  }
}
