import { DataTypes } from 'sequelize';
import sequelize from '../lib/db.js';

const UnverifiedUsers = sequelize.define('UnverifiedUsers', {
  username: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING
}, {
  timestamps: true,
  tableName: 'unverified_users'
});

export default UnverifiedUsers;