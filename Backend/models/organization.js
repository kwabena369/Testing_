const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');
const Review = require('./review'); // Ensure Review model is imported

const Organization = sequelize.define('Organization', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

Organization.belongsTo(User, { as: 'Creator', foreignKey: 'userId' });
Organization.hasMany(Review, { as: 'Reviews', foreignKey: 'organizationId' });

module.exports = Organization;
