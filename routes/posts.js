const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

// Todas as rotas de posts requerem autenticação
router.use(auth);

// Rotas de posts
router.post('/', postController.createPost);
router.get('/feed', postController.getFeed);
router.post('/:postId/like', postController.likePost);
router.post('/:postId/comment', postController.addComment);

module.exports = router; 