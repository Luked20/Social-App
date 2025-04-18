const User = require('./User');
const Post = require('./Post');
const Like = require('./Like');
const Comment = require('./Comment');
const Follow = require('./Follow');

// Associações do Post
Post.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
User.hasMany(Post, { as: 'posts', foreignKey: 'author_id' });

// Associações do Like
Post.belongsToMany(User, { through: Like, as: 'likes' });
User.belongsToMany(Post, { through: Like, as: 'likedPosts' });

// Associações do Comment
Post.hasMany(Comment, { as: 'comments', foreignKey: 'post_id' });
Comment.belongsTo(Post, { as: 'post', foreignKey: 'post_id' });
Comment.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasMany(Comment, { as: 'comments', foreignKey: 'user_id' });

// Associações do Follow
User.belongsToMany(User, {
  through: Follow,
  as: 'followers',
  foreignKey: 'following_id',
  otherKey: 'follower_id'
});

User.belongsToMany(User, {
  through: Follow,
  as: 'following',
  foreignKey: 'follower_id',
  otherKey: 'following_id'
});

module.exports = {
  User,
  Post,
  Like,
  Comment,
  Follow
}; 