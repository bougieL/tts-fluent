import path from 'path';

import fs from 'fs-extra';

import { getCachesDir, getDownloadsDir } from './_utils';

export namespace ConfigCache {
  export enum ConfigKey {
    downloadsDir = 'downloadsDir',
    transferDir = 'transferDir',
    theme = 'theme',
  }

  const getConfigPath = async () => {
    const p = path.join(await getCachesDir(), 'config.json');
    await fs.ensureFile(p);
    return p;
  };

  export async function writeConfig(key: ConfigKey, value: string | number) {
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

  export async function getConfig(key: ConfigKey) {
    let config: any = {};
    try {
      config = JSON.parse(fs.readFileSync(await getConfigPath(), 'utf-8'));
    } catch (error) {}
    return config[key];
  }

  export async function getTTSDownloadsDir(): Promise<string> {
    const downloadsDir = await getDownloadsDir();
    const configDir = await getConfig(ConfigKey.downloadsDir);
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
    const configDir = await getConfig(ConfigKey.transferDir);
    const p = configDir || downloadsDir;
    try {
      await fs.ensureDir(p);
      return p;
    } catch (error) {
      return downloadsDir;
    }
  }

  export async function getTheme(): Promise<string> {
    const theme = await getConfig(ConfigKey.theme);

    return theme || 'system';
  }
}
