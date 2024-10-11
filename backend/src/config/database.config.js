const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/myapp');
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectDB;