const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

const postSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
    },
    {timestamps: true}
)

postSchema.post('findOneAndDelete', async document => {
    const postId = document._id;
    await User.updateMany({posts: {$in: [postId]}},
        {$pull: {posts: postId}})

} )

module.exports = mongoose.model('Post', postSchema);