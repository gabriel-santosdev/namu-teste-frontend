const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const sharedRoot = path.resolve(__dirname, '../packages/shared');

const config = {
  watchFolders: [sharedRoot],
  resolver: {
    extraNodeModules: {
      '@namu/shared': sharedRoot,
    },
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
