import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { getAvatarUrlFromToken } from "../app/utils/secureStore";
import { localhost } from "../app/constants/localhost";
import * as ImagePicker from "expo-image-picker";
import useUpdateAvatar from "../hooks/user/updateAvt"; // Hook cập nhật avatar

const ProfileAvtBg = () => {
  const widthScreen = useWindowDimensions().width;
  const avatarBaseUrl = localhost;
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Dùng để hiển thị ảnh xem trước
  const [isEditing, setIsEditing] = useState(false); // Xác định trạng thái chỉnh sửa
  const { mutate, isError } = useUpdateAvatar(); // Hook cập nhật avatar

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      const avt = await getAvatarUrlFromToken();
      if (avt) {
        // Kiểm tra nếu avt đã bắt đầu bằng "https"
        if (avt.startsWith("https://")) {
          setAvatarUrl(avt); // Sử dụng trực tiếp URL nếu đã là HTTPS
        } else {
          const url = `${avatarBaseUrl}/${avt.replace(/\\/g, "/")}`;
          setAvatarUrl(url); // Thêm avatarBaseUrl nếu chưa phải HTTPS
        }
        console.log("Avatar URL:", avatarUrl);
      } else {
        console.log("Avatar token is null");
      }
    };
    fetchAvatarUrl();
  }, []); // Chỉ chạy khi component được mounted

  // Chọn hình ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPreviewImage(result.assets[0].uri); // Hiển thị hình ảnh xem trước
      setIsEditing(true); // Kích hoạt trạng thái chỉnh sửa
    }
  };

  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setPreviewImage(null);
    setIsEditing(false);
  };

  // Cập nhật avatar
  const updateAvatar = async () => {
    if (previewImage) {
      const formData = new FormData();
      const filename = previewImage.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("avt", {
        uri: previewImage,
        name: filename,
        type,
      } as any);

      mutate(formData, {
        onSuccess: () => {
          setAvatarUrl(previewImage); // Cập nhật avatar với ảnh đã chọn
          setPreviewImage(null); // Xóa hình ảnh xem trước
          setIsEditing(false); // Tắt trạng thái chỉnh sửa
          console.log("Avatar updated successfully!");
        },
        onError: (error: any) => {
          console.error("Error updating avatar:", error);
        },
      });
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: 200,
        backgroundColor: "rgba(219, 219, 219, 0.8)",
        position: "relative",
      }}
    >
      <View
        style={{
          width: 150,
          height: 150,
          backgroundColor: "white",
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 90,
          left: 15,
        }}
      >
        <Image
          source={previewImage || avatarUrl}
          style={styles.img}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </View>

      {/* Nút chỉnh sửa */}
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "white",
          borderRadius: 100,
          position: "absolute",
          top: 185,
          left: 130,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 35,
            height: 35,
            backgroundColor: "rgba(219, 219, 219, 0.8)",
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable onPress={pickImage}>
            <Image
              source={require("../../assets/img/camera.png")}
              contentFit="contain"
              cachePolicy="memory-disk"
              style={{
                width: 20,
                height: 20,
              }}
            />
          </Pressable>
        </View>
      </View>

      {/* Xử lý trạng thái chỉnh sửa */}
      {isEditing && (
        <View style={styles.editActions}>
          <Pressable
            onPress={cancelEdit}
            style={[styles.editButton, { backgroundColor: "red" }]}
          >
            <Text style={styles.editButtonText}>Hủy</Text>
          </Pressable>
          <Pressable
            onPress={updateAvatar}
            style={[styles.editButton, { backgroundColor: "green" }]}
          >
            <Text style={styles.editButtonText}>Cập nhật</Text>
          </Pressable>
        </View>
      )}
      {isError && <Text style={styles.errorText}>Lỗi khi cập nhật avatar</Text>}
    </View>
  );
};

export default ProfileAvtBg;

const styles = StyleSheet.create({
  img: {
    width: 140,
    height: 140,
    borderRadius: 100,
  },
  editActions: {
    position: "absolute",
    bottom: 20,
    left: 15,
    flexDirection: "row",
    gap: 10,
  },
  editButton: {
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
