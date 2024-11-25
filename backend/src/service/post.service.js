const Post = require("../model/post.model");
const Paginator = require("./paginator");
const UserService = require("./user.service");
const { ObjectId } = require("mongodb");
const {
  getUserName,
  getUserAvatar,
  getUserStatus,
  getUserLastOnline,
} = require("./user.service");

const createPost = async (postData) => {
  const post = new Post(postData);
  await post.save();
  return post;
};

const uploadImg = async (postId, filename) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  const imageUrl = `/uploads/${filename}`;
  post.media.push({
    type: "image",
    url: imageUrl,
  });
  await post.save();
  return post;
};

const getAllPosts = async (page, limit, userId) => {
  const paginator = new Paginator(page, limit);

  const skip = paginator.offset;
  const limitSize = paginator.limit;
  // Đảm bảo bạn đã import ObjectId

  const aggregationPipeline = [
    {
      $match: {
        is_hide: { $not: { $elemMatch: { $eq: new ObjectId(userId) } } }, // Lọc bài viết nếu is_hide chứa userId
      },
    },
    {
      $addFields: {
        countLike: { $size: "$likes" }, 
      },
    },
    {
      $sort: {
        countLike: -1, 
        created_at: -1, 
      },
    },
    {
      $skip: skip, 
    },
    {
      $limit: limitSize, 
    },
  ];
  

  
  const posts = await Post.aggregate(aggregationPipeline);

  
  const totalPosts = await Post.countDocuments({
    is_hide: { $ne: userId },
  });

  const metadata = paginator.getMetadata(totalPosts);

  
  const postsWithUserData = await Promise.all(
    posts.map(async (post) => {
      const name = await getUserName(post.user_id);
      const avatar_url = await getUserAvatar(post.user_id);
      const is_online = await getUserStatus(post.user_id);
      const last_online = await getUserLastOnline(post.user_id);
      return {
        ...post,
        name,
        avatar_url,
        is_online,
        last_online,
      };
    })
  );

  return {
    posts: postsWithUserData,
    metadata,
  };
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId);


  if (!post) {
    throw new Error("Post not found");
  }

  
  const name = await getUserName(post.user_id);
  const avatar_url = await getUserAvatar(post.user_id);
  const is_online = await getUserStatus(post.user_id);
  const last_online = await getUserLastOnline(post.user_id);

  return {
    post: {
      ...post.toObject(), 
      countLike: post.likes.length,
      name,
      avatar_url,
      is_online,
      last_online,
    },
  };
};

const getAllPostsNew = async (page, limit, userId) => {
  const paginator = new Paginator(page, limit);

  const skip = paginator.offset;
  const limitSize = paginator.limit;

  // Aggregation Pipeline
  const aggregationPipeline = [
    {
      $match: {
        is_hide: { $not: { $elemMatch: { $eq: new ObjectId(userId) } } }, // Lọc bài viết nếu is_hide chứa userId
      },
    },
    {
      $sort: {
        created_at: -1, // Sắp xếp bài viết theo ngày tạo (mới nhất trước)
      },
    },
    {
      $skip: skip, // Bỏ qua số lượng bài viết để phân trang
    },
    {
      $limit: limitSize, // Giới hạn số bài viết trên mỗi trang
    },
  ];

  // Thực thi pipeline để lấy bài viết
  const posts = await Post.aggregate(aggregationPipeline);

  // Tính tổng số bài viết (không phân trang)
  const totalPosts = await Post.countDocuments({
    is_hide: { $not: { $elemMatch: { $eq: new ObjectId(userId) } } },
  });

  // Tạo metadata phân trang
  const metadata = paginator.getMetadata(totalPosts);

  // Lấy thêm thông tin người dùng cho từng bài viết
  const postsWithUserData = await Promise.all(
    posts.map(async (post) => {
      const name = await getUserName(post.user_id);
      const avatar_url = await getUserAvatar(post.user_id);
      const is_online = await getUserStatus(post.user_id);
      const last_online = await getUserLastOnline(post.user_id);

      return {
        ...post,
        countLike: post.likes?.length || 0, // Tính số lượng likes (nếu có)
        name,
        avatar_url,
        is_online,
        last_online,
      };
    })
  );

  return {
    posts: postsWithUserData,
    metadata,
  };
};


const getPosts = async (userId) => {
  const posts = await Post.find({ user_id: userId });
  return posts.map((post) => ({
    ...post,
    countLike: post.likes.length,
  }));
};

const updatePost = async (postId, postData) => {
  const post = await Post.findByIdAndUpdate(postId, postData, { new: true });
  return post;
};

const deletePost = async (postId) => {
  await Post.findByIdAndDelete(postId);
};

const likePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
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
  if (!post) {
    throw new Error("Post not found");
  }
  post.comments.push({ user_id: userId, comment });
  await post.save();
  return post;
};

const deleteComment = async (postId, commentId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  const commentIndex = post.comments.findIndex(
    (comment) => comment.id.toString() === commentId.toString()
  );
  if (commentIndex === -1) {
    throw new Error("Comment not found");
  }
  if (post.comments[commentIndex].user_id.toString() !== userId.toString()) {
    throw new Error("Unauthorized to delete this comment");
  }
  post.comments.splice(commentIndex, 1);
  await post.save();
  return post;
};

const countComments = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  return post.comments.length;
};

const getPostComment = async (postId) => {
  // Tìm post theo ID
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  
  const commentsWithUserData = await Promise.all(
    post.comments.map(async (comment) => {
      const name = await getUserName(comment.user_id);
      const avatar_url = await getUserAvatar(comment.user_id);

      return {
        _id: comment._id,
        content: comment.comment,
        created_at: comment.created_at,
        user_id: comment.user_id,
        name,
        avatar_url,
      };
    })
  );

  return commentsWithUserData;
};

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
  const posts = await Post.find({ user_id: userId })
    .skip(paginator.offset)
    .limit(paginator.limit);
  const totalPosts = await Post.countDocuments({ user_id: userId });
  const metadata = paginator.getMetadata(totalPosts);
  const postsWithUserData = await Promise.all(
    posts.map(async (post) => {
      const name = await getUserName(post.user_id);
      const avatar_url = await getUserAvatar(post.user_id);
      const is_online = await getUserStatus(post.user_id);
      const last_online = await getUserLastOnline(post.user_id);
      return {
        ...post.toObject(),
        countLike: post.likes.length,
        name,
        avatar_url,
        is_online,
        last_online,
      };
    })
  );

  return {
    posts: postsWithUserData,
    metadata,
  };
};

const checkUserLikedPost = async (postId, userId) => {
  const post = await Post.findById(postId);
  return post.likes.includes(userId);
};

const countLike = async (postId) => {
  const post = await Post.findById(postId);
  return post.likes.length;
};

const replyToComment = async (postId, commentId, userId, reply) => {
  if (!postId || !commentId || !userId || !reply) {
    throw new Error("All parameters must be provided");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  console.log("Post found:", post);

  const commentIndex = post.comments.findIndex(
    (comment) => comment._id.toString() === commentId.toString()
  );

  if (commentIndex === -1) {
    throw new Error("Comment not found");
  }

  post.comments[commentIndex].replies.push({
    user_id: userId,
    comment: reply,
    createdAt: new Date(),
  });

  await post.save();

  console.log("Post after reply:", post);

  return post;
};

const getRepliesByPostIdAndUserId = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const allReplies = [];

  for (const comment of post.comments) {
    if (comment.user_id.toString() === userId.toString()) {
      if (comment.replies && comment.replies.length > 0) {
        const repliesWithUserInfo = await Promise.all(
          comment.replies.map(async (reply) => {
            const { user_id } = reply;
            const username = await UserService.getUserName(user_id); 
            const avatar = await UserService.getUserAvatar(user_id); 

            return {
              user_id,
              username,
              avatar,
              comment: reply.comment,
              _id: reply._id,
              created_at: reply.created_at,
            };
          })
        );

        allReplies.push({
          commentId: comment._id,
          replies: repliesWithUserInfo,
        });
      }
    }
  }

  return allReplies;
};

const updateIsHide = async (postId, userId) => {
  const post = await Post.findByIdAndUpdate(postId, { is_hide: userId });
  return post;
};



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
  countLike,
  getAllPostsNew,
  countComments,
  getPostComment,
  getPostById,
  replyToComment,
  getRepliesByPostIdAndUserId,
  updateIsHide,
};
