const Paginator = require("./paginator");
const Message = require("../model/message.model");
const { StreamChat } = require("stream-chat");

const API_KEY = 'bde7bhtputfm';
const API_SECRET = 'ctu_secret_key';
const chatClient = StreamChat.getInstance(API_KEY, API_SECRET);

const generateUserToken = async (userId) => {
    return chatClient.createToken(userId);
};

const createMessage = async (messageData) => {
    // Lưu tin nhắn vào MongoDB
    const message = new Message(messageData);
    await message.save();

    // Gửi tin nhắn đến Stream Chat
    const channel = chatClient.channel('messaging', message.conversation_id.toString()); // Xác định channel
    await channel.sendMessage({
        text: messageData.text, // Nội dung tin nhắn
        user: { id: message.user_id }, // ID của người gửi
        
    });

    return message;
};

const getMessage = async (messageId) => {
    const message = await Message.findById(messageId);
    return message;
};

const getMessageByConversationId = async (conversationId) => {
    const messages = await Message.find({ conversation_id: conversationId });
    return messages;
};

const getMessageByConversationIdAndUserId = async (conversationId, userId) => {
    const messages = await Message.find({ conversation_id: conversationId, user_id: userId });
    return messages;  
};

const updateMessage = async (messageId, messageData) => {
    const message = await Message.findByIdAndUpdate(messageId, messageData, { new: true });

    
    const channel = chatClient.channel('messaging', message.conversation_id.toString());
    await channel.updateMessage(messageId, {
        text: messageData.text, 
    });

    return message;
};

// const deleteMessage = async (messageId) => {
//     const message = await Message.findById(messageId);
//     if (message) {
        
//         await Message.findByIdAndDelete(messageId);
        
        
//         const channel = chatClient.channel('messaging', message.conversation_id.toString());
//         await channel.deleteMessage(messageId);
//     }
// };

const getAllMessage = async (page, limit) => {
    const paginator = new Paginator(page, limit);
    const messages = await Message.find().skip(paginator.offset).limit(paginator.limit);
    const totalMessages = await Message.countDocuments();
    const metadata = paginator.getMetadata(totalMessages);
    return { messages, metadata };
};

module.exports = {
    createMessage,
    getMessage,
    getMessageByConversationId,
    getMessageByConversationIdAndUserId,
    updateMessage,
    getAllMessage,
    generateUserToken,
};
