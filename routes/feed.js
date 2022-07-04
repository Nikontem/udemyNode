const express = require('express');
const {body} = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

// POST /feed/post
router.post('/post', isAuth,
    [body(['title', 'content']).trim().isLength({min: 5})], feedController.createPost);

router.put('/post/:postId', isAuth,
    [body(['title', 'content']).trim().isLength({min: 5})], feedController.editPost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

router.get('/post/:postId', isAuth, feedController.getPost);

router.get('/user/status', isAuth, feedController.getStatus);
router.put('/user/status', isAuth, feedController.updateStatus);

module.exports = router;