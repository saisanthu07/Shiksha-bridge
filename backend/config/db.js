const mongoose = require('mongoose');

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    return await cachedPromise;
  }

  const opts = {
    serverSelectionTimeoutMS: 8000,
    bufferCommands: true,
  };

  cachedPromise = mongoose.connect(process.env.MONGO_URI, opts)
    .then((m) => {
      console.log(`✅  MongoDB connected: ${m.connection.host}`);
      return m.connection;
    })
    .catch((err) => {
      cachedPromise = null;
      console.error(`❌  MongoDB connection error: ${err.message}`);
      if (!process.env.VERCEL) {
        process.exit(1);
      }
      throw err;
    });

  return await cachedPromise;
};

module.exports = connectDB;
