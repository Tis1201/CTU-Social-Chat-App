const messageService = require("../service/message.service");

const createMessage = async (req, res) => {
    const message = await messageService.createMessage(req.body);
    res.status(200).json(message);
};

const generateUserToken = async (req, res) => { 
    const token = await messageService.generateUserToken(req.params.userId);
    res.status(200).json({ token });
};

const sendMessage = async (req, res) => {   
    const message = await messageService.sendMessage(req.body);
    res.status(200).json(message);
};

const getMessage = async (req, res) => {    
    const message = await messageService.getMessage(req.params.messageId);
    res.status(200).json(message);
};

const getMessagesByConversationId = async (req, res) => {   
    const messages = await messageService.getMessagesByConversationId(req.params.conversationId);
    res.status(200).json(messages);
};

// const deleteMessage = async (req, res) => { 
//     const message = await messageService.deleteMessage(req.params.messageId);
//     res.status(200).json(message);
// };

const updateMessage = async (req, res) => { 
    const message = await messageService.updateMessage(req.params.messageId, req.body);
    res.status(200).json(message);
};


module.exports = { createMessage, generateUserToken, sendMessage, getMessage, getMessagesByConversationId, updateMessage }; 