/* eslint-disable no-console */
import path from 'path';

import chalk from 'chalk';
import fs from 'fs-extra';

import { getCachesDir } from 'caches/_utils';

enum LogType {
  log = 'log',
  error = 'error',
}

function now() {
  return new Date().toLocaleString();
}

function formatMessage(type: LogType, ...messages: any[]) {
  const color = type === LogType.error ? chalk.redBright : chalk.blueBright;
  return [chalk.gray(now()), `[${color(type.toUpperCase())}]:`, ...messages];
}

function withWritter(type: LogType, f: (...messages: any[]) => void) {
  return async function log(...messages: any[]) {
    const message = formatMessage(type, ...messages);
    if (process.env.NODE_ENV !== 'production') {
      f(...message);
    } else {
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
    }
  };
}

function main() {
  Object.keys(LogType).forEach((key) => {
    // @ts-ignore
    console[key] = withWritter(key, console[key]);
  });
}

main();
