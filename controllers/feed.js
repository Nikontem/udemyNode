const fs = require('fs');
const path = require('path');

const Post = require('../models/post');
const User = require('../models/user');

const {throwValidationErrors, commonErrorHandling, resourceNotFound, missingData} = require('../util/errorHandling');
const {operationSuccess} = require('../util/common_reposnses');
const {check_permission} = require('../util/user_authorization');

exports.getPosts = (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = 2;
    let total;
    Post.find().countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .populate('creator')
                .skip((page - 1) * perPage)
                .limit(perPage);
        })
        .then(posts => {
            operationSuccess(res, {
                posts: posts,
                totalItems: total,
            });
        })
        .catch(error => commonErrorHandling(error, next))

};

exports.createPost = async (req, res, next) => {
    throwValidationErrors(req);
    if (!req.file) {
        missingData('No Image Provided');
    }

    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: req.file.path.replace("\\", "/"),
        creator: req.userId
    });
    try{
        await post.save();
        const user = await User.findById(req.userId);
        resourceNotFound(user, next, 'User', 'Please Authenticate');
        console.log(user);
        user.posts.push(post);
        await user.save()
        return operationSuccess(res, {
            message: 'Post created!',
            post: post
        });
    }catch(error){
            commonErrorHandling(error, next);
    }
};

exports.editPost = async (req, res, next) => {
    throwValidationErrors(req);
    if (!req.file) {
        missingData('No Image Provided');
    }
    try {
        const post = await Post.findById(req.params.postId);
        resourceNotFound(post, next, 'Post');
        check_permission(req.userId.toString(), post.creator.toString());
        if (req.file) {
            clearImage(post.imageUrl);
            post.imageUrl = req.file.path.replace("\\", "/");
        }
        post.content = req.body.content;
        post.title = req.body.title;
        const result = await post.save();
        return operationSuccess(res, {
            message: 'Post update!',
            post: result
        })
    } catch (err) {
        commonErrorHandling(err, next);
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findOneAndDelete({_id: req.params.postId})
        check_permission(req.userId.toString(), post.creator.toString());
        return operationSuccess(res, {message: 'Post deleted successfully'});
    } catch (error) {
        commonErrorHandling(error, next);
    }
}

exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId)
        resourceNotFound(post, next, 'Post');
        post.imageUrl = "/" + post.imageUrl;
        return operationSuccess(res, {post: post});
    } catch (err) {
        commonErrorHandling(err, next);
    }
}

exports.getStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select(['status', '-_id']);
        return operationSuccess(res, user);
    } catch (error) {
        commonErrorHandling(error, next);
    }
}

exports.updateStatus = async (req, res, next) => {
    try{
        await User.updateOne({_id: req.userId}, {status: req.status})
        return operationSuccess(res, {message: 'Status Updated'});
    } catch(error){
        commonErrorHandling(error, next)
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        console.log(err);
    })
}
