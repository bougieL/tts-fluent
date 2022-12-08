const path = require('path');

const rootPath = path.join(__dirname, '../..');

const dllPath = path.join(__dirname, '../dll');

const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');
const srcH5Path = path.join(srcPath, 'h5');

const releasePath = path.join(rootPath, 'release');
const appPath = path.join(releasePath, 'app');
const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');
const srcNodeModulesPath = path.join(srcPath, 'node_modules');
const assetsPath = path.join(rootPath, 'assets');

const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'main');
const distRendererPath = path.join(distPath, 'renderer');
const distH5Path = path.join(distPath, 'h5');

const buildPath = path.join(releasePath, 'build');

export default {
  rootPath,
  dllPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  srcH5Path,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
  distH5Path,
  buildPath,
  assetsPath,
};
