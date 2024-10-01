const fs = require('fs');
const path = require('path');

const libsDir = path.resolve(__dirname, '../libs');

module.exports = fs.readdirSync(libsDir)
