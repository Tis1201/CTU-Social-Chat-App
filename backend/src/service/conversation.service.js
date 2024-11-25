const { ObjectId } = require("mongoose").Types; // Import ObjectId from mongoose
const Paginator = require("./paginator");
const Conversation = require("../model/conversation.model");
const userService = require("./user.service");
const { StreamChat } = require("stream-chat");
const messageService = require("./message.service");

const API_KEY = 'bde7bhtputfm';
const API_SECRET = 'ctu_secret_key';
const chatClient = StreamChat.getInstance(API_KEY, API_SECRET);

const createConversation = async (participantsInput) => {
  if (!Array.isArray(participantsInput)) {
      throw new TypeError('participantsInput must be an array');
  }

  // Correctly instantiate ObjectId
  const participants = participantsInput.map(id => new ObjectId(id)); // Convert to ObjectId

  // Get creatorId from the first participant
  const creatorId = participantsInput[0]; // Use the first participant as creatorId

  try {
      // Check if the conversation already exists
      const existingConversation = await Conversation.findOne({
          participants: { $all: participants } // Find conversation with all participants
      });

      if (existingConversation) {
          console.log('Cuộc hội thoại đã tồn tại:', existingConversation);
          return existingConversation; // Return existing conversation
      }

      const usersToCreate = await Promise.all(participantsInput.map(async (id) => {
        const name = await userService.getUserName(id); // Lấy tên người dùng
        const avatar = await userService.getUserAvatar(id); // Lấy avatar người dùng
        const token = await messageService.generateUserToken(id); // Lấy token người dùng
        return {
            id: id,                // ID người dùng
            name: name,            // Tên người dùng từ userService
            image: avatar,         // Ảnh đại diện từ userService
            token: token,          // Token người dùng
        };
    }));

    for (const user of usersToCreate) {
      await chatClient.upsertUser(user);
    }

    // Tạo tên kênh chỉ dựa trên tên người khác
    const otherParticipantId = participantsInput.find(id => id !== creatorId); // Lấy ID người tham gia khác
    const otherParticipantName = await userService.getUserName(otherParticipantId); // Lấy tên người tham gia khác

    // Tạo tên kênh từ tên người tham gia khác
    const channelName = otherParticipantName; // Chỉ hiện tên người tham gia khác

    // If not, create a new conversation
    const conversation = new Conversation({ participants });
    await conversation.save();

    // Create channel in Stream Chat
    const channel = chatClient.channel('messaging', conversation._id.toString(), {
        name: channelName, // Sử dụng tên kênh đã tạo
        members: participantsInput,
        created_by: { id: creatorId } // Specify the user creating the channel
    });
    await channel.create(); // Create channel in Stream Chat

    console.log('Channel created successfully in Stream Chat:', channel);
    return conversation;

  } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Could not create conversation');
  }
};

const updateChannelName = async (channelId, newName) => {
  const channel = chatClient.channel('messaging', channelId);
  await channel.update({ name: newName });
  console.log(`Updated channel name to: ${newName}`);
};

// Giả sử bạn có hàm này để người dùng vào kênh
const joinChannel = async (userId, otherParticipantId) => {
  const otherParticipantName = await userService.getUserName(otherParticipantId);
  const channelId = // Lấy channel ID mà người dùng đang vào;

  // Cập nhật tên kênh
  await updateChannelName(channelId, otherParticipantName);
};



// Các hàm còn lại không thay đổi
const getConversation = async (conversationId) => {
  const conversation = await Conversation.findById(conversationId);
  return conversation;
};

const getConversationByUserId = async (userId) => {
  const conversation = await Conversation.find({ participants: userId });
  return conversation;
};

const updateConversation = async (conversationId, conversationData) => {
  const conversation = await Conversation.findByIdAndUpdate(conversationId, conversationData, { new: true });
  return conversation;
};

const deleteConversation = async (conversationId) => {
  await Conversation.findByIdAndDelete(conversationId);
  // Cũng có thể xóa channel tương ứng nếu cần
  // await chatClient.channel('messaging', conversationId).delete(); // Xóa channel trong Stream Chat
};

const getAllConversation = async (page, limit) => {
  const paginator = new Paginator(page, limit);
  const conversations = await Conversation.find().skip(paginator.offset).limit(paginator.limit);
  const totalConversations = await Conversation.countDocuments();
  const metadata = paginator.getMetadata(totalConversations);
  return { conversations, metadata };
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
