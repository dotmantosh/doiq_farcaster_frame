import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

async function dbConnect() {
  if (connection.isConnected) {
    console.log('Already connected to the database.');
    return;
  }

  if (!process.env.MONGODB_URI_DEV) {
    throw new Error('MONGODB_URI_DEV environment variable is not defined.');
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI_DEV as string);

    connection.isConnected = db.connections[0].readyState;

    if (connection.isConnected === 1) {
      console.log('Connected to the database.');
    } else {
      console.log('Failed to connect to the database.');
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

export default dbConnect;