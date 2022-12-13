/* eslint-disable no-console */
const chalk = require('chalk');
const fs = require('fs-extra');
const { exec } = require('./_utils');

const arg = process.argv[2];

async function main(arg) {
  function buildStatic(type) {
    console.log(chalk.blueBright(`Start build ${type}`));
    exec(`pnpm webpack --config ./.erb/configs/webpack.config.${type}.prod.ts`);
    fs.removeSync(`assets/${type}`);
    fs.copySync(`release/app/dist/${type}`, `assets/${type}`);
    fs.removeSync(`release/app/dist/${type}`);
    console.log(chalk.blueBright(`Finish build ${type}`));
  }

  function buildPlatform(platform = 'all') {
    console.log(chalk.blueBright(`Start build ${platform} platform`));
    fs.removeSync('release/build');
    fs.removeSync('release/app/dist');
    buildStatic('h5');
    exec('pnpm run build');
    let args = '--win --mac --linux';
    if (platform === 'win') {
      args = '--win';
    } else if (platform === 'mac') {
      args = '--mac';
    }
    exec(`pnpm electron-builder build --publish never ${args}`);
    console.log(chalk.blueBright(`Finish build ${platform} platform`));
  }

  if (arg === 'static') {
    // buildStatic();
    buildStatic('h5');
  } else if (arg) {
    buildPlatform(arg);
  }
}

if (require.main === module) {
  // console.log(arg)
  main(arg);
}
