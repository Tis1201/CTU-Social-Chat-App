const { validationResult } = require('express-validator');
const postService = require('../service/post.service');
const multer = require('multer');
const { getIo } = require('../sockets/socket');

const createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { content, media, location } = req.body;
    
        // Tạo bài đăng mới với user_id từ req.user
        const newPost = await postService.createPost({
            user_id: req.user.id,
            content,
            media,
            location
        });
    
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(400).json({ message: 'Lỗi khi tạo bài đăng', error: {} });
    }
};

const uploadImg = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No image file uploaded' });
        }

        const postId = req.params.id;
        const filename = req.file.filename; 
        // console.log('filename:::', filename)
        const updatedPost = await postService.uploadImg(postId, filename);
        res.status(200).json({ message: 'File uploaded successfully', post: updatedPost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


const getAllPosts = async (req, res) => {
    try {  
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};  

const getPostById = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getPostByLocation = async (req, res) => {         
    try {
        const posts = await postService.getPostByLocation(req.params.location);
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const likePost = async (req, res) => {
    try {
        const post = await postService.likePost(req.params.id, req.user.id);
        const io = getIo();
        io.emit('postUpdated', post.id);
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};  

const commentPost = async (req, res) => {
    try {
        const post = await postService.commentPost(req.params.id, req.body.userId, req.body.comment);
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteComment = async (req, res) => {     
    try {
        const post = await postService.deleteComment(req.params.id, req.body.userId, req.body.commentId);
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deletePost = async (req, res) => {
    try {
        await postService.deletePost(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getPostByUser = async (req, res) => {
    try {
        const posts = await postService.getPostByUser(req.user.id);
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');           
    }
};

const checkUserLikedPost = async (req, res) => {
    try {
        const isLiked = await postService.checkUserLikedPost(req.params.id, req.user.id);
        const io = getIo();
        io.emit('postUpdated', isLiked.isLiked);
        res.json({ isLiked });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const countLike = async (req, res) => {
    try {
        const count = await postService.countLike(req.params.id);
        const io = getIo();
        io.emit('postUpdated', count.count);
        res.json({ count });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    getPostByLocation,
    likePost,
    commentPost,
    deleteComment,
    deletePost,
    getPostByUser,
    uploadImg,
    checkUserLikedPost,
    countLike
};

