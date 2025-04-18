const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Conteúdo do post é obrigatório' });
    }

    const post = await Post.create({
      content,
      author_id: req.user.id
    });

    const postWithAuthor = await Post.findByPk(post.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'username', 'profile_picture']
      }]
    });

    res.status(201).json(postWithAuthor);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ 
      message: 'Erro ao criar post', 
      error: error.message,
      details: error.errors ? error.errors.map(err => err.message) : null
    });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'username', 'profile_picture']
        },
        {
          model: User,
          as: 'likes',
          attributes: ['id', 'name', 'username', 'profile_picture']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ 
      message: 'Erro ao buscar posts', 
      error: error.message,
      details: error.errors ? error.errors.map(err => err.message) : null
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const hasLiked = await post.hasLike(user);

    if (hasLiked) {
      await post.removeLike(user);
    } else {
      await post.addLike(user, { through: { user_id: user.id, post_id: post.id } });
    }

    const updatedPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'username', 'profile_picture']
        },
        {
          model: User,
          as: 'likes',
          attributes: ['id', 'name', 'username', 'profile_picture']
        }
      ]
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Erro ao curtir post:', error);
    res.status(500).json({ 
      message: 'Erro ao curtir post', 
      error: error.message
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findByPk(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    const comment = await post.createComment({
      content,
      user_id: req.user.id
    });

    const updatedPost = await Post.findByPk(post.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'username', 'profile_picture']
      }]
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ 
      message: 'Erro ao adicionar comentário', 
      error: error.message,
      details: error.errors ? error.errors.map(err => err.message) : null
    });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { author_id: req.params.userId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'username', 'profile_picture']
        },
        {
          model: User,
          as: 'likes',
          attributes: ['id', 'name', 'username', 'profile_picture']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar posts do usuário', error: error.message });
  }
}; 