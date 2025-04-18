const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'clone-social',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'lucas2006',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

module.exports = sequelize; 