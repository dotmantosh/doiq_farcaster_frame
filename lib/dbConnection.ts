import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

// const URI = process.env.MONGODB_URI_DEV
const URI = process.env.MONGODB_URI
console.log('uri from dbconnections: ', URI)

async function dbConnect() {
  if (connection.isConnected) {
    console.log('Already connected to the database.');
    return;
  }



  if (!URI) {
    console.log('no database uri')
    throw new Error('MONGODB_URI_DEV environment variable is not defined.');
  }

  try {
    const db = await mongoose.connect(URI as string);

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



// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(URI, opts).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }


export default dbConnect;