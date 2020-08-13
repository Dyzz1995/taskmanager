/* eslint-disable no-console */
const mongoose = require('mongoose');

const connectDb = async ({ poolSize = 1, databaseUrl = process.env.DATABASE_URL } = {}) => {
  try {
    return mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      autoReconnect: true,
      keepAlive: true,
      connectTimeoutMS: 900000,
      socketTimeoutMS: 900000,
      poolSize,
      reconnectTries: 5,
      reconnectInterval: 500,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error('Connect database error: ', error);
    return error;
  }
};

module.exports = { connectDb };
