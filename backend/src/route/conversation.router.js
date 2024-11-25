const express = require("express");
const router = express.Router();
const conversationController = require("../controller/conversation.controller");

router.post("/", conversationController.createConversation);
router.get("/", conversationController.getAllConversation);
router.get("/:conversationId", conversationController.getConversation);
router.get("/user/:userId", conversationController.getConversationByUserId);
router.put("/:conversationId", conversationController.updateConversation);
router.delete("/:conversationId", conversationController.deleteConversation);
router.get("/", conversationController.getAllConversation);
router.post("/join/:conversationId", conversationController.joinChannel);
router.put("/:conversationId", conversationController.updateChannelName);

module.exports = router;
