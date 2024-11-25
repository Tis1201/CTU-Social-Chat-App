const conversationService = require("../service/conversation.service");

const createConversation = async (req, res) => {
    console.log("Request body:", req.body); // Kiểm tra giá trị của req.body

    if (!req.body.participantsInput || !Array.isArray(req.body.participantsInput)) {
        return res.status(400).json({ error: "Participants must be an array" });
    }

    try {
        const conversation = await conversationService.createConversation(req.body.participantsInput);
        res.status(201).json(conversation);
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({ error: "Could not create conversation" });
    }
};


const getConversation = async (req, res) => {
  const conversation = await conversationService.getConversation(req.params.conversationId);
  res.status(200).json(conversation);
};

const getConversationByUserId = async (req, res) => {
  const conversation = await conversationService.getConversationByUserId(req.params.userId);
  res.status(200).json(conversation);
};

const updateConversation = async (req, res) => {
  const conversation = await conversationService.updateConversation(req.params.conversationId, req.body);
  res.status(200).json(conversation);
};

const deleteConversation = async (req, res) => {
  await conversationService.deleteConversation(req.params.conversationId);
  res.status(204).send();
};

const getAllConversation = async (req, res) => {
  const { page, limit } = req.query;
  const conversations = await conversationService.getAllConversation(page, limit);
  res.status(200).json(conversations);
};

const joinChannel = async (req, res) => {
  const conversation = await conversationService.joinChannel(req.params.conversationId, req.body.userId);
  res.status(200).json(conversation);
};

const updateChannelName = async (req, res) => {
  const conversation = await conversationService.updateChannelName(req.params.conversationId, req.body.name);
  res.status(200).json(conversation);
};

module.exports = {
  createConversation,
  getConversation,
  getConversationByUserId,
  updateConversation,
  deleteConversation,
  getAllConversation,
  joinChannel,
  updateChannelName,
};
