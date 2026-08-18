import bcrypt from 'bcrypt';
import User from './models/User.js';
import connectDB from './config/db.js';

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password', 10);
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        address: 'Main Restaurant Street',
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Admin user seeded successfully into MongoDB!');
    } else {
      console.log('ℹ️ Admin user already exists in MongoDB.');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
