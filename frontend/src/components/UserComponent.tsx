import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import { localhost } from "../app/constants/localhost";
import { Link } from "expo-router";
const UserComponent = ({ user }: { user: any }) => {
  console.log("user", user);

  // Sửa đường dẫn ảnh với Regex
  const correctedAvatarUrl = `${localhost}/${user.avatar_url.replace(/\\/g, "/")}`;

  return (
    <Link href={`/asset/ProfileUID?uid=${user._id}`}>
      <View style={styles.container}>
        <View style={styles.userInfo}>
          {/* Avatar người dùng */}
          <Image
            source={{ uri: correctedAvatarUrl }} // Sử dụng đường dẫn đã sửa
            style={styles.avatar}
          />
          {/* Tên người dùng */}
          <Text style={styles.name}>{user.full_name}</Text>
        </View>
      </View>
    </Link>
  );
};

export default UserComponent;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
