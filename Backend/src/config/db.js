// src/config/db.js ✅ Mongoose-based MongoDB connection
const mongoose = require('mongoose');
const { mongoURI } = require('./env');

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      dbName: 'simplytix_Development', // Optional: set DB name here or inside URI
    });
    console.log('✅ MongoDB connected with Mongoose');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
