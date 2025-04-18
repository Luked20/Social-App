const User = require('../models/User');
const Post = require('../models/Post');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          association: 'followers',
          attributes: ['username', 'name', 'profile_picture']
        },
        {
          association: 'following',
          attributes: ['username', 'name', 'profile_picture']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, profile_picture } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (profile_picture) user.profile_picture = profile_picture;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findByPk(req.params.userId);
    const currentUser = await User.findByPk(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se já está seguindo
    const isFollowing = await currentUser.hasFollowing(userToFollow);
    
    if (isFollowing) {
      // Deixar de seguir
      await currentUser.removeFollowing(userToFollow);
    } else {
      // Seguir
      await currentUser.addFollowing(userToFollow);
    }

    const followersCount = await userToFollow.countFollowers();

    res.json({
      following: !isFollowing,
      followersCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao seguir/deseguir usuário', error: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { author_id: req.params.userId },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'username', 'profile_picture']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar posts do usuário', error: error.message });
  }
}; 