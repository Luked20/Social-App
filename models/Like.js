const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class Like extends Model {}

Like.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Like',
  tableName: 'likes',
  timestamps: true,
  underscored: true
});

module.exports = Like; 