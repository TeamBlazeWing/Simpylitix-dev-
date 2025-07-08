require('dotenv').config();

const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

module.exports = {
  port: process.env.PORT,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};
