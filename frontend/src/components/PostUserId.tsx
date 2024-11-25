import {
  StyleSheet,
  Text,
  View,
  Platform,
  useWindowDimensions,
  Pressable,
  Alert,
} from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { localhost } from "../app/constants/localhost";
import useSocket from "../socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  toggleLike,
  fetchLikeCount,
  fetchUserLikeStatus,
} from "../../redux/likeSlice";
import { fetchLikePosts } from "../hooks/post/fetchLikePost";
import moment from "moment";
import { getUserIdFromToken } from "../app/utils/secureStore";
import { StreamChat } from "stream-chat";
import { useCommentCount } from "../hooks/post/fetchCountComment";
import useUpdateHide from "../hooks/post/updateHide";

interface PostProps {
  post: any;
  onHidePost: (postId: string) => void; // Callback để thông báo ẩn bài viết
}
const API_KEY = "bde7bhtputfm";
const client = StreamChat.getInstance(API_KEY);
const PostUserId: React.FC<PostProps> = ({ post, onHidePost }) => {
  const avatarBaseUrl = localhost;
  const socket = useSocket();
  const dispatch = useDispatch();
  const [uid, setUid] = useState("");
  const { data } = useCommentCount(post._id);
  const { mutate: hidePost, isError } = useUpdateHide();

  const likesState = useSelector(
    (state: RootState) => state.like.likesState
  ) as { [key: string]: any };
  const isLiked = likesState[post._id as string];
  const countLike = useSelector((state: RootState) => state.like.countLike) as {
    [key: string]: any;
  };
  const count = countLike[post._id as string];

  const avatarUrl = post.avatar_url.startsWith("http")
    ? post.avatar_url
    : `${avatarBaseUrl}/${post.avatar_url.replace(/\\/g, "/")}`;

  const mediaUrl =
    post.media && post.media.length > 0
      ? `${avatarBaseUrl}${post.media[0].url}`
      : null;

  const handleLikePost = useCallback(async () => {
    dispatch(toggleLike(post._id)); // Thay đổi trạng thái like
    socket.socket?.emit("postUpdated", post._id);
    await fetchLikePosts(post._id);
    dispatch(fetchLikeCount(post._id) as any);
  }, [dispatch, post._id, socket]);

  useEffect(() => {
    dispatch(fetchUserLikeStatus(post._id) as any);
    dispatch(fetchLikeCount(post._id) as any);
    const fetchUserId = async () => {
      const id = await getUserIdFromToken();
      setUid(id || "");
    };
    fetchUserId();
  }, [dispatch, post._id]);

  useEffect(() => {
    const handlePostUpdate = (updatedPostId: string) => {
      if (updatedPostId === post._id) {
        dispatch(fetchUserLikeStatus(updatedPostId) as any);
        dispatch(fetchLikeCount(updatedPostId) as any);
      }
    };

    socket.socket?.on("postUpdated", handlePostUpdate);

    return () => {
      socket.socket?.off("postUpdated", handlePostUpdate);
    };
  }, [dispatch, post._id, socket]);

  const lastOnlineTime = post.is_online
    ? "Online"
    : `Online ${moment(post.last_online).fromNow()}`;

  const [currentId, setCurrentId] = useState<string | null>(null);
  const userId = post.user_id; // Lấy ID người dùng từ bài đăng
  const [isChatting, setIsChatting] = useState(false); // Trạng thái theo dõi cuộc hội thoại

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const id = await getUserIdFromToken();
      setCurrentId(id);
    };

    fetchCurrentUserId();
  }, []);
  const handleChat = async () => {
    if (currentId && userId && !isChatting && currentId !== userId) {
      setIsChatting(true); // Đánh dấu là đang trò chuyện
      console.log(`Bắt đầu trò chuyện giữa ${currentId} và ${userId}`);

      try {
        const participantsInput = [String(currentId), String(userId)];
        console.log("Tham số participants:", participantsInput);

        // Fetch API để tạo hoặc lấy cuộc hội thoại
        const response = await fetch(`${localhost}/conversations/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ participantsInput }), // Gửi mảng participants
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create conversation: ${errorText}`);
        }

        const data = await response.json();
        console.log("Cuộc hội thoại đã được tạo thành công:", data);

        const conversationId = data._id; // Lấy conversationId từ kết quả trả về

        // "Watch" kênh đã được tạo từ API
        const channel = client.channel("messaging", conversationId, {
          members: participantsInput, // Đảm bảo là mảng
        });

        // Theo dõi kênh
        await channel.watch();
        console.log(`Đang theo dõi kênh với conversationId: ${conversationId}`);

        // Điều hướng đến màn hình Chat với conversationId
        router.push({
          pathname: "/(stacks)",
          params: { conversationId },
        });
      } catch (error) {
        console.error("Lỗi khi theo dõi kênh cuộc hội thoại:", error);
      } finally {
        setIsChatting(false);
      }
    } else {
      console.log("Không đủ thông tin để bắt đầu trò chuyện.");
    }
  };

  const handleMorePress = () => {
    Alert.alert(
      "Ẩn bài viết",
      "Bạn có muốn ẩn bài viết này không?",
      [
        { text: "Hủy", onPress: () => console.log("Hủy"), style: "cancel" },
        {
          text: "Đồng ý",
          onPress: () => {
            hidePost(post._id, {
              onSuccess: () => {
                console.log(`Bài viết ${post._id} đã được ẩn thành công.`);
                onHidePost(post._id); // Call the callback to remove the post
              },
              onError: (error) => {
                console.error("Lỗi khi ẩn bài viết:", error.message);
              },
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ marginTop: 10, paddingBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          paddingHorizontal: 10,
        }}
      >
        <Link href={`/asset/ProfileUID?uid=${post.user_id}`} asChild>
          <Pressable>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 10,
              }}
            >
              <Image
                source={avatarUrl}
                style={{ width: 50, height: 50, borderRadius: 100 }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
              <View style={{ marginRight: Platform.OS === "ios" ? 25 : 35 }}>
                <Text style={{ fontWeight: "light", fontSize: 17 }}>
                  {post.name}
                </Text>
                <Text style={{ color: "gray", fontSize: 11 }}>
                  {lastOnlineTime}
                </Text>
              </View>
            </View>
          </Pressable>
        </Link>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          {uid && uid !== post.user_id && (
            <View
              style={{
                width: 80,
                height: 25,
                backgroundColor: "rgba(150,149,151,0.08)",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
              }}
            >
              <Pressable onPress={handleChat}>
                <Text
                  style={{
                    color: "rgba(193,1,241,0.3)",
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                >
                  Trò chuyện
                </Text>
              </Pressable>
            </View>
          )}
          <Pressable onPress={handleMorePress}>
            <Image
              source={require("../../assets/img/more.png")}
              style={{ width: 20, height: 20 }}
            />
          </Pressable>
        </View>
      </View>
      <View>
        <Text style={{ paddingLeft: 15, paddingTop: 15 }}>{post.content}</Text>
        <Link
          href={`/asset/asset?mediaUrl=${mediaUrl ? encodeURIComponent(mediaUrl) : ""}`}
          asChild
        >
          {post.media.length > 0 && (
            <Pressable>
              <Image
                source={mediaUrl}
                style={{
                  width: "100%",
                  height: 250,
                  aspectRatio: 3 / 4,
                  borderRadius: 15,
                  marginLeft: 10,
                  marginTop: 10,
                }}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            </Pressable>
          )}
        </Link>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          paddingHorizontal: 20,
          paddingTop: 15,
          paddingBottom: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable onPress={handleLikePost}>
            <Image
              source={
                isLiked
                  ? require("../../assets/img/heart-red.png")
                  : require("../../assets/img/heart-nofill.png")
              }
              style={{ width: 25, height: 25 }}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </Pressable>
          <Text>{count}</Text>
        </View>
        <Link
          href={`/asset/comment?postId=${post._id ? encodeURIComponent(post._id) : ""}`}
          asChild
        >
          <Pressable>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Image
                source={require("../../assets/img/comment.png")}
                style={{ width: 25, height: 25 }}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
              <Text>{data?.count || 0}</Text>
            </View>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default PostUserId;

const styles = StyleSheet.create({});
