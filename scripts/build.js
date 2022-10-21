/* eslint-disable no-console */
const { execSync: nativeExecSync } = require('child_process');
const chalk = require('chalk');

const arg = process.argv[2];

function exec(command) {
  return nativeExecSync(command, { stdio: 'inherit' });
}

async function main(arg) {
  function buildTransfer() {
    console.log(chalk.blueBright('Start build transfer'));
    exec(
      'pnpm cross-env NODE_ENV=production TS_NODE_TRANSPILE_ONLY=true webpack --config ./.erb/configs/webpack.config.transfer.prod.ts'
    );
    exec('rm -r assets/transfer || true');
    exec('cp -r release/app/dist/transfer assets');
    exec('rm -r release/app/dist/transfer');
    console.log(chalk.blueBright('Finish build transfer'));
  }

  if (arg === 'transfer') {
    buildTransfer();
  }

  if (arg === 'all') {
    console.log(chalk.blueBright('Start build all platform'));
    exec('rm -r release/build || true');
    exec('rm -r release/app/dist || true');
    buildTransfer();
    exec('npm run build');
    exec('pnpm electron-builder build --publish never --win --mac --linux');
    console.log(chalk.blueBright('Finish build all platform'));
  }

  if (!arg) {
    console.log(chalk.blueBright('Start build current platform'));
    exec('rm -r release/build || true');
    exec('rm -r release/app/dist || true');
    buildTransfer();
    exec('npm run build');
    exec('pnpm electron-builder build --publish never');
    console.log(chalk.blueBright('Finish build current platform'));
  }
}

if (require.main === module) {
  // console.log(arg)
  main(arg);
}
