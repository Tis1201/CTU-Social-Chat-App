const express = require("express");
const router = express.Router();
const messageController = require("../controller/message.controller");

router.post("/", messageController.createMessage);
router.get("/:userId", messageController.generateUserToken);
router.post("/send", messageController.sendMessage);
router.get("/:messageId", messageController.getMessage);
router.get("/conversation/:conversationId", messageController.getMessagesByConversationId);
// router.delete("/:messageId", messageController.deleteMessage);
router.put("/:messageId", messageController.updateMessage);

module.exports = router;
