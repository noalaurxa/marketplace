const sequelize = require('./src/config/database');
const User = require('./src/models/user');
const bcrypt = require('bcrypt');

async function run() {
  try {
    const users = await User.findAll();
    console.log('USERS IN DB:');
    for (const u of users) {
      const isCustomer123 = await bcrypt.compare('customer123', u.passwordHash);
      const isAdmin123 = await bcrypt.compare('admin123', u.passwordHash);
      console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}`);
      console.log(`  Matches 'customer123': ${isCustomer123}`);
      console.log(`  Matches 'admin123': ${isAdmin123}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
