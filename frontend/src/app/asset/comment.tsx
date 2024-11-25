import {
  StyleSheet,
  Text,
  View,
  Platform,
  useWindowDimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useCallback, useState } from "react";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import { localhost } from "../../app/constants/localhost";
import useSocket from "../../socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  toggleLike,
  fetchLikeCount,
  fetchUserLikeStatus,
} from "../../../redux/likeSlice";
import { fetchLikePosts } from "../../hooks/post/fetchLikePost";
import moment from "moment";
import { getUserIdFromToken } from "../../app/utils/secureStore";
import { usePostId } from "../../hooks/post/fecthPostById";
import Comment from "../../components/Comment";
import TextInputComment from "../../components/TextInputComment";

// Định nghĩa kiểu cho phần tử media
interface Media {
  type: string;
  url: string;
  _id: string;
}

// Định nghĩa kiểu cho đối tượng JSON chính
interface PostData {
  post: {
    media: Media[];
    _id: string;
    user_id: string;
    content: string;
    avatar_url: string;
    is_online: boolean;
    last_online: string;
    name: string;
  };
}

const CommentScreen = () => {
  // Đổi tên component từ 'comment' thành 'CommentScreen' để theo chuẩn React
  const windowWidth = useWindowDimensions().width;
  const avatarBaseUrl = localhost;
  const socket = useSocket();
  const { postId } = useLocalSearchParams(); // Lấy postId từ query parameter
  const postIdString = Array.isArray(postId) ? postId[0] : postId;

  // Hooks should be called unconditionally
  const { data, error } = usePostId(postIdString);
  const dispatch = useDispatch();

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [reloadInput, setReloadInput] = useState(false); // State để theo dõi việc làm mới
  const [reloadComments, setReloadComments] = useState(false);
  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const id = await getUserIdFromToken();
      setCurrentId(id);
    };
    fetchCurrentUserId();
  }, []);

  // Ensure `data.post` is available and accessible
  const post = data?.post;
  if (!post) return null;

  const mediaUrls = post.media?.map((item: Media) => item.url) || [];

  const avatarUrl = post.avatar_url.startsWith("http")
    ? post.avatar_url
    : `${avatarBaseUrl}/${post.avatar_url.replace(/\\/g, "/")}`;

  const mediaUrl =
    mediaUrls.length > 0 ? `${avatarBaseUrl}${mediaUrls[0]}` : null;

  const lastOnlineTime = post.is_online
    ? "Online"
    : `Online ${moment(post.last_online).fromNow()}`;

  // Hàm làm mới input
  const handleReloadInput = () => {
    setReloadInput((prev) => !prev);
    console.log("comment reload", reloadComments);
    setReloadComments((prev) => !prev);
  };
  const handleReloadComplete = () => {
    setReloadComments(false); // Đặt reloadComments về false sau khi refetch
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginTop: 10,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              paddingHorizontal: 10,
            }}
          >
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
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Image
                source={require("../../../assets/img/more.png")}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            </View>
          </View>
          <View>
            <Text style={{ paddingLeft: 15, paddingTop: 15 }}>
              {post.content}
            </Text>
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
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Image
                source={require("../../../assets/img/comment.png")}
                style={{ width: 25, height: 25 }}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            </View>
          </View>
        </View>
        <Comment
          postId={post._id}
          reload={reloadComments}
          onReloadComplete={handleReloadComplete}
        />
      </ScrollView>
      <TextInputComment postId={post._id} onReload={handleReloadInput} userId={post.user_id} />
    </SafeAreaView>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: Platform.OS === "android" ? 45 : 0,
  },
});
