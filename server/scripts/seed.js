const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');
const connectDB = require('../config/db');

// Initial users data
const users = [
  {
    firstName: 'Admin',
    middleName: '',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin'
  },

  {
    firstName: 'Editor',
    middleName: '',
    lastName: 'User',
    email: 'editor@example.com',
    password: 'Editor123@',
    role: 'editor'
  },
  {
    firstName: 'Viewer',
    middleName: '',
    lastName: 'User',
    email: 'viewer@example.com',
    password: 'Viewer123#',
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
