import {
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import useCreateComment from "../hooks/post/createComment"; // Import hook tạo comment
import { useSendNotification } from "../hooks/notification.ts/sendNotification"; // Import hook gửi thông báo
import {
  getUserIdFromToken,
  getUserNameFromToken,
} from "../app/utils/secureStore";
interface TextInputCommentProps {
  postId: string;
  onReload: () => void; // Nhận hàm reload từ component cha
  userId: string; // ID người nhận thông báo
}

const TextInputComment: React.FC<TextInputCommentProps> = ({
  postId,
  onReload,
  userId,
}) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createComment } = useCreateComment();
  const { mutate: sendNotification } = useSendNotification();

  const handleSendComment = async () => {
    const uid = await getUserIdFromToken();
    if (!comment.trim()) return;

    setIsLoading(true);
    if (uid && userId !== uid) {
      createComment(
        { userId: uid, comment, postId },
        {
          onSuccess: async () => {
            // Gửi thông báo đến server
            const userName = await getUserNameFromToken();

            sendNotification({
              user_id: userId,
              related_user_id: uid,
              type: "post_commented",
              content: `${userName} vừa bình luận bài viết của bạn`,
              related_post_id: postId,
            });

            setComment("");
            setIsLoading(false);
            onReload();
          },
          onError: () => {
            setIsLoading(false);
          },
        }
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <View style={styles.commentContainer}>
            <TextInput
              placeholder="Bình luận bài viết"
              style={styles.textInput}
              value={comment}
              onChangeText={setComment}
              multiline
              scrollEnabled
            />
            <TouchableWithoutFeedback onPress={handleSendComment}>
              <View>
                <Image
                  source={require("../../assets/img/send.png")}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default TextInputComment;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    position: "relative",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
  },
  commentContainer: {
    gap: 4,
    backgroundColor: "rgba(150,149,151,0.08)",
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    padding: 10,
    minHeight: 40,
    maxHeight: 100,
  },
});
