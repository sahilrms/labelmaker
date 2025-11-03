const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const uri = 'mongodb://localhost:27017/label-maker';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    
    // Create users collection if it doesn't exist
    await db.createCollection('users');
    
    const usersCollection = db.collection('users');
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@mail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin);
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = {
      email: 'admin@mail.com',
      password: hashedPassword,
      plainPassword: 'admin123', // Only for development/testing
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the admin user
    const result = await usersCollection.insertOne(adminUser);
    console.log('Admin user created successfully:', {
      email: adminUser.email,
      role: adminUser.role,
      _id: result.insertedId
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

// Run the function
createAdminUser().catch(console.error);
