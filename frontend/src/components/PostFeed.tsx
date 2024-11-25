import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Text,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import useCreatePost from "../hooks/post/CreatePost";
import { getUserIdFromToken } from "../app/utils/secureStore";
import { useRouter } from "expo-router";
const PostFeed = () => {
  const router = useRouter();
  const [caption, setCaption] = useState("Have not a caption");
  const [image, setImage] = useState<string | null>(null);
  const { mutate, isError, isSuccess } = useCreatePost();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    const userId = await getUserIdFromToken();
    if (userId) {
      formData.append("user_id", userId);
    }

    formData.append("content", caption);

    // Kiểm tra nếu ảnh tồn tại, thêm vào formData với dạng blob
    if (image) {
      const filename = image.split("/").pop()!;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("media", {
        uri: image,
        name: filename,
        type: type,
      } as any);
    }

    // Gửi location dưới dạng các trường riêng lẻ
    const location = {
      type: "Point",
      coordinates: [106.701, 10.775],
    };

    formData.append("location[type]", location.type);
    formData.append(
      "location[coordinates][0]",
      location.coordinates[0].toString()
    );
    formData.append(
      "location[coordinates][1]",
      location.coordinates[1].toString()
    );

    // Gọi mutate để gửi formData
    mutate(formData);
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Bạn đang nghĩ gì?"
            onChangeText={(newCaption) => setCaption(newCaption)}
            multiline
            style={styles.textInput}
          />
        </View>

        <View style={styles.imageContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.selectedImage}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={styles.noimg} />
          )}
        </View>

        <View style={styles.iconContainer}>
          <Pressable onPress={pickImage}>
            <Image
              source={require("../../assets/img/photo1.png")}
              style={styles.icon}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
          </Pressable>
          <Image
            source={require("../../assets/img/location-pin.png")}
            style={styles.icon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </View>

        <Pressable onPress={handleSubmit} style={styles.submitButton}>
          <Text>Đăng bài</Text>
        </Pressable>

        {isError && <Text style={styles.errorText}>Lỗi khi gửi bài!</Text>}
        {isSuccess && (
          <Text style={styles.successText}>Bài đã được gửi thành công!</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default PostFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  inputContainer: {
    padding: 20,
  },
  textInput: {
    fontSize: 16,
  },
  imageContainer: {
    aspectRatio: 3 / 4,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  noimg: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 8,
    backgroundColor: "#cbd5e1",
  },
  iconContainer: {
    padding: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  successText: {
    color: "green",
    textAlign: "center",
  },
});
