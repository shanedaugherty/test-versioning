const fs = require('fs');
const path = require('path');

const appsDir = path.resolve(__dirname, '../apps');

module.exports = fs.readdirSync(appsDir)
