import mongoose from 'mongoose';
import config from './index.js';

export default async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI is missing. Please check your Atlas connection string in .env.');
  }

  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB Atlas');
}
