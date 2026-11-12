const { spawnSync } = require('child_process');
const path = require('path');

const androidDir = path.join(__dirname, '..', 'android');
const gradlew = path.join(
  androidDir,
  process.platform === 'win32' ? 'gradlew.bat' : 'gradlew',
);

const result = spawnSync(gradlew, ['assembleDebug', '-PembedBundle'], {
  cwd: androidDir,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status === 0) {
  console.log(
    `\nAPK gerado em ${path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')}`,
  );
}

process.exit(result.status ?? 1);
