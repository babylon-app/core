const fs = require('fs');
const pkg = require('../package.json');

pkg.main = 'index.js';
pkg.scripts = {};
pkg.devDependencies = {};


fs.writeFileSync(__dirname + '/../dist/package.json', JSON.stringify(pkg, null, 4));

