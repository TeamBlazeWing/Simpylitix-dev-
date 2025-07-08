const env = require('./env');
const db = require('./db');

module.exports = {
  env,
  connectDB: db.connectDB,
};
