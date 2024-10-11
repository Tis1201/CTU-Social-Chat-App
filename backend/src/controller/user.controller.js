// controllers/userController.js
const { validationResult } = require('express-validator');
const userService = require('../service/user.service');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No avatar file uploaded' });
        }

        const avatarUrl = await userService.updateAvatar(req.params.id, req.file);
        res.json({ msg: 'Avatar updated successfully', avatar_url: avatarUrl });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

const updateBackground = async (req, res) => {
    try {
        if (!req.files || !req.files.background) {
            return res.status(400).json({ msg: 'No background file uploaded' });
        }

        const backgroundUrl = await userService.updateBackground(req.params.id, req.files.background);
        res.json({ msg: 'Background updated successfully', background_url: backgroundUrl });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

const getAllUsersExceptCurrent = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const currentUserId = req.user.id; // Lấy currentUserId từ middleware hoặc cách khác

        // Gọi hàm xử lý chính
        const result = await userService.fetchUsersExceptCurrent(currentUserId, page, limit);
        res.json(result);
    } catch (error) {
        console.error('Error in getAllUsersExceptCurrent controller:', error);
        res.status(500).json({ error: error.message });
    }
};

const getUserByGender = async (req, res) => {
    try {
        const { gender, page = 1, limit = 10 } = req.query;
        const currentUserId = req.user.id; // Lấy currentUserId từ middleware hoặc cách khác
        // Gọi hàm xử lý chính
        const result = await userService.fetchUserByGender(currentUserId, gender, page, limit);
        res.json(result);
    } catch (error) {
        console.error('Error in getUserByGender controller:', error);
        res.status(500).json({ error: error.message });
    }
};

const updateBehavior = async (req, res) => {
    try {
        const { behavior } = req.body;
        const currentUserId = req.user.id; // Lấy currentUserId từ middleware hoặc cách khác
        const updatedUser = await userService.updateBehavior(currentUserId, behavior);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error in updateBehavior controller:', error);
        res.status(500).json({ error: error.message }); 
    }
};

const getBehavior = async(req, res) => { 
    try{
        const currentUserId = req.user.id;
        const user = await userService.getBehavior(currentUserId);
        res.json(user)

    }catch (err){
        console.error('Error in getBehavior controller:', error);
        res.status(500).json({ error: error.message }); 
    }
}

const checkRefreshTokenHasExpired = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const isExpired = await userService.checkRefreshTokenHasExpired(currentUserId);
        res.json(isExpired);
    } catch (error) {
        console.error('Error in checkRefreshTokenHasExpired controller:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateAvatar,
    updateBackground,
    getAllUsersExceptCurrent,
    getUserByGender,
    updateBehavior,
    getBehavior,
    checkRefreshTokenHasExpired
};
