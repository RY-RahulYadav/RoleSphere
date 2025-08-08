const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');
const connectDB = require('../config/db');

// Initial users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Editor User',
    email: 'editor@example.com',
    password: 'editor123',
    role: 'editor'
  },
  {
    name: 'Viewer User',
    email: 'viewer@example.com',
    password: 'viewer123',
    role: 'viewer'
  }
];

// Connect to database
connectDB();

const importData = async () => {
  try {
    // Clear existing users
    await User.deleteMany();
    console.log('Deleted all existing users');
    
    // Create users
    for (const userData of users) {
    
      
      await User.create({
        ...userData,
      });
    }
    
    console.log('Data imported successfully!');
    console.log('\nUser credentials:');
    users.forEach(user => {
      console.log(`Role: ${user.role.toUpperCase()}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('-------------------');
    });
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
