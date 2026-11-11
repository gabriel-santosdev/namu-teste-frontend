export default {
  displayName: 'shared',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['@swc/jest', { jsc: { parser: { syntax: 'typescript' } } }],
  },
};
