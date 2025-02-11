const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reviewText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId :{
     type :DataTypes.INTEGER,
     allowNull:false
  }
}, {
  timestamps: true,
});

module.exports = Review;
