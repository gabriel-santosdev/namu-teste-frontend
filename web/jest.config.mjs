export default {
  displayName: 'web',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/test/polyfills.ts'],
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
  },
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/test/styleStub.ts',
    '\\.(webp|png|jpg|jpeg|svg)$': '<rootDir>/src/test/fileStub.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
