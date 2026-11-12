export default {
  displayName: 'web',
  testEnvironment: '<rootDir>/src/test/environment.cjs',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
    '[\\\\/]node_modules[\\\\/]until-async[\\\\/].+\\.js$': [
      '@swc/jest',
      { module: { type: 'commonjs' } },
    ],
  },
  transformIgnorePatterns: ['[\\\\/]node_modules[\\\\/](?!until-async[\\\\/])'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/test/styleStub.ts',
    '\\.(webp|png|jpg|jpeg|svg)$': '<rootDir>/src/test/fileStub.ts',
    '^@/config/env$': '<rootDir>/src/test/envStub.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
