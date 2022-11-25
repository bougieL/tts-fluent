/* eslint-disable no-console */
const { execSync: nativeExecSync } = require('child_process');

function exec(command) {
  return nativeExecSync(command, {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      CSC_IDENTITY_AUTO_DISCOVERY: false,
      TS_NODE_TRANSPILE_ONLY: true,
    },
  });
}

module.exports = {
  exec,
};
