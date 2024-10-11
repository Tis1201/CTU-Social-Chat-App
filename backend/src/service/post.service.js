const Post = require('../model/post.model');
const Paginator = require('./paginator');
const User = require('../model/user.model');
const { getUserName, getUserAvatar } = require('./user.service');


const createPost =  async (postData) => {
    const post = new Post(postData);
    await post.save();
    return post;
};

const uploadImg = async (postId,filename) => {
    const post = await Post.findById(postId);
    if(!post){
        throw new Error('Post not found');
    }
    const imageUrl = `/uploads/${filename}`;
    post.media.push({
        type: 'image',
        url: imageUrl
    });
    await post.save();
    return post;
}

const getAllPosts = async (page, limit) => {
    const paginator = new Paginator(page, limit);
    const posts = await Post.find().skip(paginator.offset).limit(paginator.limit);
    const totalPosts = await Post.countDocuments();
    const metadata = paginator.getMetadata(totalPosts);

    const postsWithUserData = await Promise.all(posts.map(async post => {
        const name = await getUserName(post.user_id);
        const avatar_url = await getUserAvatar(post.user_id);
        
        return {
            ...post.toObject(), // Chuyển đổi Mongoose document thành object thông thường
            countLike: post.likes.length,
            name,
            avatar_url
        };
    }));

    return {
        posts: postsWithUserData,
        metadata
    };
}

const getPosts = async (userId) => {
    const posts = await Post.find({ user_id: userId });
    return posts.map(post => ({
        ...post,
        countLike: post.likes.length
    }));
}

const updatePost = async (postId, postData) =>{
    const post = await Post.findByIdAndUpdate(postId, postData, { new: true });
    return post;
}

const deletePost = async (postId) => {
    await Post.findByIdAndDelete(postId);
}   

const likePost = async (postId, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }
    const userIndex = post.likes.indexOf(userId);
  
    if (userIndex !== -1) {
      post.likes.splice(userIndex, 1);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    return post;
  };
  

const commentPost = async (postId, userId, comment) => {
    const post = await Post.findById(postId);   
    if(!post){
        throw new Error('Post not found');
    }
    post.comments.push({ user_id: userId, comment });
    await post.save();
    return post;
}

const deleteComment = async (postId, commentId, userId) => {
    const post = await Post.findById(postId);
    if(!post){
        throw new Error('Post not found');
    }
    const commentIndex = post.comments.findIndex(comment => comment.id.toString() === commentId.toString());
    if(commentIndex === -1){
        throw new Error('Comment not found');
    }
    if(post.comments[commentIndex].user_id.toString() !== userId.toString()){
        throw new Error('Unauthorized to delete this comment');
    }
    post.comments.splice(commentIndex, 1);
    await post.save();
    return post;
}   
    // async deleteComment(postId, commentId){
    //     const post = await Post.findById(postId);
    //     if(!post){
    //         throw new Error('Post not found');
    //     }
    //     post.comments = post.comments.filter(comment => comment.id.toString() !== commentId.toString());
    //     await post.save();
    //     return post;
    // },

    // async getPostByLocation(location){
    //     const posts = await Post.find({ location });
    //     return posts;
    // },   
const getPostByUser = async (userId, page, limit) => {
    const paginator = new Paginator(page, limit);   
    const posts = await Post.find({ user_id: userId }).skip(paginator.offset).limit(paginator.limit);
    const totalPosts = await Post.countDocuments({ user_id: userId });
    const metadata = paginator.getMetadata(totalPosts);
    const postsWithUserData = await Promise.all(posts.map(async post => {
        const name = await getUserName(post.user_id);
        const avatar_url = await getUserAvatar(post.user_id);
        
        return {
            ...post.toObject(),
            countLike: post.likes.length,
            name,
            avatar_url
        };
    }));

    return {
        posts: postsWithUserData,
        metadata
    };
}

const checkUserLikedPost = async (postId, userId) => {
    const post = await Post.findById(postId);
    return post.likes.includes(userId);
}   

const countLike = async (postId) => {
    const post = await Post.findById(postId);
    return post.likes.length;
}
module.exports = {
    createPost,
    uploadImg,
    getPosts,
    updatePost,
    deletePost,
    likePost,
    commentPost,
    deleteComment,
    getAllPosts,
    getPostByUser,
    checkUserLikedPost,
    countLike
};