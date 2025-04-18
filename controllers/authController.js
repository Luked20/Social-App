const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET || 'sua_chave_secreta',
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    console.log('📝 Tentativa de registro:', { username, email, name });

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      console.log('❌ Usuário já existe:', existingUser.email);
      return res.status(400).json({ message: 'Email ou nome de usuário já está em uso' });
    }

    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password,
      username
    });

    console.log('✅ Usuário criado:', user.id);

    // Gerar token
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔑 Tentativa de login:', email);

    // Encontrar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ Usuário não encontrado:', email);
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Senha incorreta para:', email);
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    console.log('✅ Login bem sucedido:', user.id);

    // Gerar token
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
}; 