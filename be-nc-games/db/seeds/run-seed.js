const devData = require('../data/development-data/index.js');
const {seed} = require('./seed.js');
const db = require('../index');

seed(devData).then(() => db.end());



