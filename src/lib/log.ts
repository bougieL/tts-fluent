/* eslint-disable no-console */
import os from 'os';
import path from 'path';

import fs from 'fs-extra';

import { getCachesDir } from 'caches/_utils';

import pkg from '../../release/app/package.json';

const { version } = pkg;

// const isDev = process.env.NODE_ENV !== 'production';
const isDev = false;

enum LogType {
  log = 'log',
  error = 'error',
  warn = 'warn',
}

function now() {
  return new Date().toLocaleString();
}

function formatMessage(type: LogType, ...messages: any[]) {
  const stacks = messages.map((item) => {
    if (item instanceof Error) {
      return item.stack || String(item) || 'Unkown error';
    }
    return item;
  });
  return [
    `[${now()}]`,
    `[${version}]`,
    `[${os.platform()}]`,
    `[${os.arch()}]`,
    `[${type.toUpperCase()}]:`,
    ...stacks,
    '\n\n',
  ];
}

function withWritter(type: LogType) {
  return async function log(...messages: any[]) {
    const message = formatMessage(type, ...messages);
    const dir = await getCachesDir();
    const date = new Date();
    const fp = path.join(
      dir,
      'logs',
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}.log`
    );
    await fs.ensureFile(fp);
    fs.appendFile(fp, message.join(' '));
  };
}

function main() {
  if (isDev) {
    return;
  }
  Object.keys(LogType).forEach((key) => {
    // @ts-ignore
    console[key] = withWritter(key);
  });
  if (global.process) {
    process.addListener('unhandledRejection', console.error);
    process.addListener('uncaughtException', console.error);
  }
  if (global.window) {
    window.addEventListener('unhandledrejection', console.error);
  }
}

main();
