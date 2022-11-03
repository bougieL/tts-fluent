/* eslint-disable no-console */
const chalk = require('chalk');
const { exec } = require('./_utils');

const arg = process.argv[2];

async function main(arg) {
  function buildTransfer() {
    console.log(chalk.blueBright('Start build transfer'));
    exec(
      'pnpm webpack --config ./.erb/configs/webpack.config.transfer.prod.ts'
    );
    exec('rm -r assets/transfer || true');
    exec('cp -r release/app/dist/transfer assets');
    exec('rm -r release/app/dist/transfer');
    console.log(chalk.blueBright('Finish build transfer'));
  }

  function buildPlatform(platform = 'all') {
    console.log(chalk.blueBright(`Start build ${platform} platform`));
    exec('rm -r release/build || true');
    exec('rm -r release/app/dist || true');
    buildTransfer();
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

  if (arg === 'transfer') {
    buildTransfer();
  } else if (arg) {
    buildPlatform(arg);
  }
}

if (require.main === module) {
  // console.log(arg)
  main(arg);
}
