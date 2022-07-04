const fs = require('fs');
const path = require('path');

const Post = require('../models/post');

const {throwValidationErrors, commonErrorHandling, resourceNotFound, missingData} = require('../util/errorHandling');
const {operationSuccess} = require('../util/common_reposnses');

exports.getPosts = (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = 2;
    let total;
    Post.find().countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((page - 1)* perPage)
                .limit(perPage);
        })
        .then(posts => {
            operationSuccess(res,{
                posts: posts,
                totalItems: total
            });
        })
        .catch(error=> commonErrorHandling(error,next))

};

exports.createPost = (req, res, next) => {
    throwValidationErrors(req);
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
            operationSuccess(res,{
                message: 'Post created!',
                post: result
            });
        })
        .catch((err) => {
            commonErrorHandling(err, next);
        });
};

exports.editPost = (req, res, next) => {
    throwValidationErrors(req);
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
            operationSuccess(res,{
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
            return operationSuccess(res,{message:'Post deleted successfully'});
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
            return operationSuccess(res,{post:post});
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
