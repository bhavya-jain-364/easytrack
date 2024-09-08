// lib/mongodb.js

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

// Create and cache the client and db instances
let cachedClient = null;
let cachedDb = null;

const clientPromise = MongoClient.connect(MONGODB_URI, {
}).then((client) => {
  cachedClient = client;
  cachedDb = client.db(MONGODB_DB);
  return client;
});

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await clientPromise;
  const db = cachedDb;

  return { client, db };
}

export { clientPromise };
