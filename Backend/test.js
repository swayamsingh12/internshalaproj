const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connection OK');
    process.exit(0);
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  }
})();
