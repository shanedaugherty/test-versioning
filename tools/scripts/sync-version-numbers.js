const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const repoRoot = path.resolve(__dirname, '../../');

const updateDeps = (current) => {
  const next = { ...current };

  Object.keys(next?.dependencies ?? {}).forEach((key) => {
    if (key.includes('@test-versioning')) {
      next.dependencies[key] = '*';
    }
  });

  Object.keys(next?.devDependencies ?? {}).forEach((key) => {
    if (key.includes('@test-versioning')) {
      next.devDependencies[key] = '*';
    }
  });

  return next;
};

const currentRootPkg = require(path.resolve(repoRoot, 'package.json'));

const rootPkg = updateDeps(currentRootPkg);

fs.writeFileSync(path.resolve(repoRoot, 'package.json'), JSON.stringify(rootPkg));
exec(`npx prettier --write '${path.resolve(repoRoot, 'package.json')}'`);

const libs = [...require('../lib-names')].map(
  (name) => `../libs/${name}/package.json`
);

const apps = [...require('../app-names')].map((name) => `../apps/${name}/package.json`);

const updatePackageJson = async (path) => {
  try {
    const current = await require(path);

    const next = updateDeps(current);

    // update version field
    next.version = rootPkg.version;

    fs.writeFileSync(path, JSON.stringify(next));

    exec(`npx prettier --write ${path}`);

    console.log(`Updated version in ${path}`);

    return next;
  } catch (ex) {}
};

Promise.all([...apps, ...libs].map((path) => updatePackageJson(path)))
  .then(() => {
    console.log('Synced all version numbers.');
  })
  .catch((error) => {
    console.log(error);
  });
