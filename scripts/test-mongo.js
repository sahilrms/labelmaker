const { MongoClient } = require('mongodb');

async function testConnection() {
  // Replace with your MongoDB connection string
  const uri = 'mongodb://localhost:27017/labelmaker';
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Successfully connected to MongoDB');

    // Get the database
    const db = client.db();

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Check if users collection exists
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`Found ${userCount} users in the database`);

    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log('Users:', JSON.stringify(users, null, 2));

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}

testConnection().catch(console.error);
