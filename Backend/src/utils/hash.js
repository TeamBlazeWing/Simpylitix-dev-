const bcrypt = require('bcrypt');

exports.hashPassword = async (plainText) => {
  return await bcrypt.hash(plainText, 10);
};

exports.comparePassword = async (plainText, hash) => {
  return await bcrypt.compare(plainText, hash);
};
