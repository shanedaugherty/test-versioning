const appPackageJsons = require('./tools/lib-names').map(
    (pkg) => `./apps/${pkg}/package.json`
)

const libPackageJsons = require('./tools/app-names').map(
    (pkg) => `./libs/${pkg}/package.json`
)

console.log({appPackageJsons, libPackageJsons})

module.exports = {
    pkgRoot: `./`,
    tagFormat: 'v${version}',
    debug: true,
    ci: true,
    branches: [
        'main',
        {
            name: 'staging',
            prerelease: true
        }
    ],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md'
            }
        ],
        '@semantic-release/npm',
        [
            '@semantic-release/exec',
            {
                prepareCmd:
                    'yarn generate-build-numbers && yarn sync-version-numbers && git stage .'
            }
        ],
        [
            '@semantic-release/git',
            {
                assets: [
                    'package.json',
                    ...appPackageJsons,
                    ...libPackageJsons,
                    'yarn.lock',
                    '**/android-version-code.json',
                    'CHANGELOG.md'
                ]
            }
        ],
        '@semantic-release/github'
    ]
};
