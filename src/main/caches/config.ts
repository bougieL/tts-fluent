import { app } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { cachesDir } from './_utils';

export enum ConfigKey {
  downloadsDir = 'downloadsDir',
}

const configPath = path.join(cachesDir, 'config.json');

// console.log(configPath)

// const cache = createCache<Record<ConfigKey, string>>(configPath);

export function writeConfig(key: ConfigKey, value: string | number) {
  fs.ensureFileSync(configPath);
  let config: any = {};
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (error) {}
  config[key] = value;
  try {
    fs.writeFileSync(configPath, JSON.stringify(config));
  } catch (error) {}
}

export function getConfig(key: ConfigKey) {
  let config: any = {};
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch (error) {}
  return config[key];
}

export function getDownloadsDir(): string {
  return getConfig(ConfigKey.downloadsDir) || app.getPath('downloads');
}
