import { app } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { getCachesDir } from './_utils';

export namespace ConfigCache {
  export enum ConfigKey {
    downloadsDir = 'downloadsDir',
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
      config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
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

  export async function getDownloadsDir(): Promise<string> {
    const p =
      (await getConfig(ConfigKey.downloadsDir)) || app.getPath('downloads');
    await fs.ensureDir(p);
    return p;
  }
}
