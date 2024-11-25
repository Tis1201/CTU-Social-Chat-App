import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { usePostId } from "../hooks/post/fetchCommentByPost";
import { localhost } from "../app/constants/localhost";

interface CommentProps {
  postId: string;
  reload: boolean;
  onReloadComplete: () => void;
}

const Comment: React.FC<CommentProps> = ({
  postId,
  reload,
  onReloadComplete,
}) => {
  const [comments, setComments] = useState<any[]>([]);
  const { data, isLoading, error, refetch } = usePostId(postId);

  useEffect(() => {
    if (data) {
      setComments(data);
    }
  }, [data]);

  useEffect(() => {
    if (reload) {
      refetch().then(() => {
        onReloadComplete();
      });
    }
  }, [reload, refetch, onReloadComplete]);

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Đã xảy ra lỗi khi tải dữ liệu.</Text>;

  const renderComment = (comment: any) => {
    const avatarBaseUrl = localhost;
    const defaultAvatar = "https://example.com/images/default-avatar.png";
    const isValidUrl = (url: string) => {
      try {
        return Boolean(new URL(url));
      } catch (e) {
        return false;
      }
    };

    const avatarUrl = isValidUrl(comment.avatar_url)
      ? comment.avatar_url
      : `${avatarBaseUrl}/${comment.avatar_url.replace(/\\/g, "/")}`;
    const finalAvatarUrl = isValidUrl(avatarUrl) ? avatarUrl : defaultAvatar;

    return (
      <View key={comment._id}> 
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        >
          <Image
            source={{ uri: finalAvatarUrl }}
            style={{
              width: 45,
              height: 45,
              borderRadius: 100,
              marginBottom: 30,
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <View>
            <View
              style={{
                gap: 4,
                backgroundColor: "rgba(150,149,151,0.08)",
                alignSelf: "flex-start",
                padding: 12,
                borderRadius: 20,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {comment.name}
              </Text>
              <Text>{comment.content}</Text>
            </View>
            <Text style={{ paddingLeft: 10, paddingTop: 5 }}>Trả lời</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {comments.length > 0 ? (
        comments.map(renderComment)
      ) : (
        <Text>Không có bình luận nào.</Text>
      )}
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({});
