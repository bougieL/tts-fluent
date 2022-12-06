/* eslint-disable no-console */
const chalk = require('chalk');
const { exec } = require('./_utils');

const arg = process.argv[2];

async function main(arg) {
  function buildStatic(type) {
    console.log(chalk.blueBright(`Start build ${type}`));
    exec(`pnpm webpack --config ./.erb/configs/webpack.config.${type}.prod.ts`);
    exec(`rm -r assets/${type} || true`);
    exec(`cp -r release/app/dist/${type} assets`);
    exec(`rm -r release/app/dist/${type}`);
    console.log(chalk.blueBright(`Finish build ${type}`));
  }

  function buildPlatform(platform = 'all') {
    console.log(chalk.blueBright(`Start build ${platform} platform`));
    exec('rm -r release/build || true');
    exec('rm -r release/app/dist || true');
    buildStatic('transfer');
    buildStatic('badanmu');
    exec('npm run build');
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
    buildStatic('badanmu');
  } else if (arg) {
    buildPlatform(arg);
  }
}

if (require.main === module) {
  // console.log(arg)
  main(arg);
}
