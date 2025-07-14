require('dotenv').config();       // Load .env
require('./config/env');          // Validate .env

const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🖳.....http://localhost:${PORT}`);
  });
});


