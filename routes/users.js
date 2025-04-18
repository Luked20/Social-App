const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Todas as rotas de usuários requerem autenticação
router.use(auth);

// Rotas de usuários
router.get('/profile/:userId', userController.getProfile);
router.get('/:userId/posts', userController.getUserPosts);
router.put('/profile', userController.updateProfile);
router.post('/follow/:userId', userController.followUser);

module.exports = router; 