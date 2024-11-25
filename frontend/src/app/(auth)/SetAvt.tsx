import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import useUpdateAvatar from "../../hooks/user/updateAvt";
import { Pressable } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { logout } from "../utils/secureStore";

const SetAvt = () => {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { mutate, isError } = useUpdateAvatar();
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://runningcalendar.co.za/images/Blank-Avatar.jpg"
  );
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPreviewImage(result.assets[0].uri); // Hiển thị hình ảnh xem trước
    }
  };

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
        onSuccess: async () => {
          setAvatarUrl(previewImage); // Cập nhật avatar với ảnh đã chọn
          setPreviewImage(null); // Xóa hình ảnh xem trước
          console.log("Avatar updated successfully!");
          await logout();
          router.push("/login");
        },
        onError: (error: any) => {
          console.error("Error updating avatar:", error);
        },
      });
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "flex-start", alignItems: "center" }}
    >
      <View style={{ paddingBottom: 70 }}>
        <Text
          style={{
            fontSize: 23,
            fontWeight: "bold",
            marginTop: 20,
            marginLeft: 20,
          }}
        >
          Cập nhật ảnh đại diện của bạn
        </Text>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "300",
            marginTop: 5,
            marginLeft: 30,
            color: "gray",
          }}
        >
          Ảnh đẹp sẽ làm bạn trở nên thu hút hơn
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 305,
          height: 305,
          borderWidth: 3,
          borderColor: "gray",
          borderRadius: 305,
          position: "relative",
          marginBottom: 100,
        }}
      >
        <Image
          source={{ uri: previewImage || avatarUrl }}
          style={{ width: 300, height: 300, borderRadius: 300 }}
          contentFit="cover"
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: 70,
          height: 70,
          backgroundColor: "white",
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
          top: 420,
          right: 90,
        }}
      >
        <Pressable onPress={pickImage}>
          <Image
            source={require("../../../assets/img/camera.png")}
            style={{ width: 35, height: 35 }}
          />
        </Pressable>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#2980b8",
          padding: 10,
          borderRadius: 40,
          width: "50%",
          alignItems: "center",
          marginTop: 10,
          height: 80,
          justifyContent: "center",
        }}
        activeOpacity={0.9}
        onPress={updateAvatar}
      >
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
          Cập nhật
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SetAvt;

const styles = StyleSheet.create({});
