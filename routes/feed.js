const express = require('express');
const {body} = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post',
    [body(['title', 'content']).trim().isLength({min: 5})],feedController.createPost);

router.put('/post/:postId',
    [body(['title', 'content']).trim().isLength({min: 5})],feedController.editPost);

router.delete('/post/:postId', feedController.deletePost);

router.get('/post/:postId', feedController.getPost);

module.exports = router;