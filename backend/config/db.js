const mongoose = require('mongoose');

global.isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('⚠️  No MONGODB_URI found in .env');
    return false;
  }

  console.log('🔗 Connecting to MongoDB Atlas...');

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 seconds for Atlas cloud connection
    });
    global.isMongoConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    global.isMongoConnected = false;
    console.log(`❌ MongoDB Connection Failed: ${error.message}`);
    console.log(`ℹ️  Running in Resilient Zero-Setup Mode (Auto-Fallback Store Active).`);
    console.log(`   Tip: Check your MONGODB_URI, username, password, and network access in Atlas.`);
    return false;
  }
};

module.exports = connectDB;

