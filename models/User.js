const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  password: DataTypes.STRING
}, {});

User.sync()
  .then(() => console.log('User table has been created'))
  .catch(error => console.log('Error occurred', error));

module.exports = User;



