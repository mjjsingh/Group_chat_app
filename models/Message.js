const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  sender: DataTypes.INTEGER,
  recipient: DataTypes.INTEGER,
  message: DataTypes.TEXT,
  timestamp: DataTypes.DATE
});

module.exports = Message;
