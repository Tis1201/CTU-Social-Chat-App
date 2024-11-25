import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { useFetchNotifi } from "../hooks/notification.ts/fetchNotifi";
import { getUserIdFromToken } from "../app/utils/secureStore";
import { localhost } from "../app/constants/localhost";

const Notification = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdFromToken();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const { data, isLoading, error } = useFetchNotifi(userId || "");

  const handlePress = () => {
    if (!isPressed) {
      setIsPressed(true); // Chỉ đổi màu nền khi nhấn lần đầu
    }
  };

  if (userId === null) return null;

  const avatarUrl = `${localhost}/${data?.notifications[0].related_user.avatar_url.replace(/\\/g, "/")}`;

  return (
    <View style={{ width: screenWidth }}>
      <Text style={styles.headerText}>Thông báo</Text>
      <Text style={styles.subHeaderText}>Hôm nay</Text>

      <FlatList
        data={data?.notifications}
        renderItem={({ item }: { item: any }) => (
          <Pressable
            key={item._id}
            onPress={handlePress}
            style={[
              styles.notificationView,
              { backgroundColor: isPressed ? "#FFFFFF" : "#F0FDFF" },
            ]}
          >
            <Image
              source={{ uri: avatarUrl }}
              style={styles.profileImage}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
            <Image
              source={require("../../assets/img/comment-1.png")}
              style={styles.commentIcon}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
            <View style={{ flex: 1, flexWrap: "wrap" }}>
              <Text style={{ fontWeight: "bold" }}>
                {item.related_user.full_name}
              </Text>
              <Text> {item.content}</Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  subHeaderText: {
    fontWeight: "bold",
    fontSize: 15,
    paddingLeft: 20,
    paddingBottom: 15,
  },
  notificationView: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    height: 80,
    gap: 10,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 100,
  },
  commentIcon: {
    width: 25,
    height: 25,
    borderRadius: 100,
    top: 45,
    left: 65,
    position: "absolute",
  },
});
