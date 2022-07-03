const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');

const Post = require('../models/post');

const {commonErrorHandling, resourceNotFound, missingData} = require('../util/errorHandling');

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({
                posts: posts
            });
        })
        .catch(error=> commonErrorHandling(error,next))

};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        missingData('Validation failed, entered data is incorrect.');
    }
    if(!req.file){
        missingData('No Image Provided');
    }

    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: req.file.path.replace("\\" ,"/"),
        creator: {
            name: 'Nikos'
        }
    });

    post.save()
        .then(result => {
            res.status(201).json({
                message: 'Post created!',
                post: result
            });
        })
        .catch((err) => {
            commonErrorHandling(err, next);
        });
};

exports.editPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        missingData('Validation failed, entered data is incorrect.');
    }
    if(!req.file){
        missingData('No Image Provided');
    }

    Post.findById(req.params.postId)
        .then(post => {
            resourceNotFound(post, next, 'Post');
            if(req.file){
                clearImage(post.imageUrl);
                post.imageUrl = req.file.path.replace("\\" ,"/");
            }
            post.content = req.body.content;
            post.title = req.body.title;
            return post.save();
        })
        .then((result) =>{
            res.status(201).json({
                message: 'Post update!',
                post: result
            });
        })
        .catch(err=>{
            commonErrorHandling(err,next);
        })
}

exports.deletePost = (req, res, next) =>{
    Post.findOneAndDelete({_id: req.params.postId})
        .then(result => {
            return res.status(200).json({message:'Post deleted successfully'});
        })
        .catch(error =>{
            commonErrorHandling(error,next);
        })
}

exports.getPost = (req, res, next)=> {
    Post.findById(req.params.postId)
        .then(post => {
            resourceNotFound(post,next, 'Post');
            post.imageUrl = "/"+ post.imageUrl;
            return res.status(200).json({post:post});
        })
        .catch(err=>{
            commonErrorHandling(err, next);
        })
}

const clearImage = filePath =>{
    filePath  = path.join(__dirname,'..',filePath);
    fs.unlink(filePath,err => {
        console.log(err);
    })
}
