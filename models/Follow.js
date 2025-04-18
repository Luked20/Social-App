const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class Follow extends Model {}

Follow.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  following_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Follow',
  tableName: 'follows',
  indexes: [
    {
      unique: true,
      fields: ['follower_id', 'following_id']
    }
  ]
});

module.exports = Follow; 