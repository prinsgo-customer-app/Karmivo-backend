require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../models/Role');

const roles = ['SUPER_ADMIN', 'ADMIN', 'CUSTOMER', 'PARTNER'];

const seedRoles = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/karmivo';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    for (const roleName of roles) {
      const existing = await Role.findOne({ name: roleName });
      if (!existing) {
        await Role.create({ name: roleName, description: `Default ${roleName} role` });
        console.log(`Created role: ${roleName}`);
      }
    }

    console.log('Roles seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
};

seedRoles();
