const { spawnSync } = require('child_process');
const path = require('path');

const eslint = path.join(
  path.dirname(require.resolve('eslint/package.json')),
  'bin',
  'eslint.js',
);

const result = spawnSync(
  process.execPath,
  [eslint, '.', ...process.argv.slice(2)],
  {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: { ...process.env, ESLINT_USE_FLAT_CONFIG: 'false' },
  },
);

process.exit(result.status ?? 1);
