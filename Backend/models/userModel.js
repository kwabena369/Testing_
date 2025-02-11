const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  supabaseId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = User;
