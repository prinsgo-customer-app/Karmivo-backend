require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const Role = require('./models/Role');

const PORT = process.env.PORT || 3000;

const seedDefaultRoles = async () => {
  try {
    const roles = ['SUPER_ADMIN', 'ADMIN', 'CUSTOMER', 'PARTNER'];
    for (const roleName of roles) {
      const existing = await Role.findOne({ name: roleName });
      if (!existing) {
        await Role.create({ name: roleName, description: `Default ${roleName} role` });
        console.log(`Auto-seeded role: ${roleName}`);
      }
    }
  } catch (err) {
    console.error('Failed to seed default roles on startup:', err);
  }
};

const startServer = async () => {
  if (process.env.NODE_ENV !== 'test') {
    await connectDB();
    await seedDefaultRoles();
  }

  app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
