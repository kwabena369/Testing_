const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const User = require('./userModel');
const Organization = require('./organization');
const Review = require('./review');

// Define associations
Organization.belongsTo(User, { as: 'Creator', foreignKey: 'userId' });
Organization.hasMany(Review, { as: 'Reviews', foreignKey: 'organizationId' });
Review.belongsTo(Organization, { foreignKey: 'organizationId' });

module.exports = {
  User,
  Organization,
  Review,
};
