const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const repoRoot = path.resolve(__dirname, '../../');
const androidVersionCodeFilePath = path.resolve(repoRoot, 'apps/mobile/androidVersionCode.json')


const pkg = { ...require(path.resolve(repoRoot,'package.json')) };
const nextVersion = pkg.version;

const nextUserAppVersionCode =
  parseInt(
    require(androidVersionCodeFilePath)
  ) + 1;

console.log({
  nextVersion,
  __dirname,
  nextUserAppVersionCode
});

fs.writeFileSync(
  androidVersionCodeFilePath,
  String(nextUserAppVersionCode)
);

// fs.writeFileSync(
//   path.resolve('../../libs/static-configs/src/generated/version_number.json'),
//   `"${String(nextVersion)}"`
// );

exec(`git stage ${androidVersionCodeFilePath}`);

console.log('Next build numbers generated.');
