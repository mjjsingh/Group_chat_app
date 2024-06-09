const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  sender: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recipient: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'Messages',
  timestamps: true,
});

Message.sync({ alter: true }) // Use alter instead of sync to update tables without dropping
  .then(() => console.log('Message table has been created'))
  .catch(error => console.log('Error occurred', error));

module.exports = Message;

