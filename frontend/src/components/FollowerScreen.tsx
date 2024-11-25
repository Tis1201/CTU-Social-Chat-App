import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import UserComponent from "./UserComponent";
import { useFollower } from "../hooks/user/getFollower";

const FollowerScreen = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.goBack();
  };

  // Hook lấy dữ liệu
  const { data: follower, isLoading, isError } = useFollower();
  console.log("Follower data:", follower);

  return (
    <View>
      {/* Header */}
      <View>
        <Pressable
          onPress={handlePress}
          style={{ paddingLeft: 15, paddingTop: 15 }}
        >
          <Image
            source={require("../../assets/img/left-arrow.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </Pressable>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 23,
            textAlign: "center",
          }}
        >
          Người theo dõi bạn
        </Text>
        <View
          style={{
            width: "100%",
            paddingVertical: 15,
            paddingHorizontal: 35,
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(250, 248, 249, 1)",
              borderRadius: 25,
              flexDirection: "row",
              height: 40,
              alignItems: "center",
              paddingLeft: 15,
            }}
          >
            <Image
              source={require("../../assets/img/search-chat.png")}
              style={{ width: 23, height: 23, resizeMode: "contain" }}
            />
            <Text style={{ color: "gray", fontSize: 17 }}>
              Tìm kiếm người theo dõi bạn
            </Text>
          </View>
        </View>
      </View>

      {/* Status Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
          {follower ? `${follower.length} người theo dõi bạn` : "Đang tải..."}
        </Text>
        <Text style={{ color: "blue" }}>Sắp xếp</Text>
      </View>

      {/* Hiển thị danh sách */}
      <View style={{ padding: 15 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : isError ? (
          <Text>Đã xảy ra lỗi khi tải dữ liệu</Text>
        ) : follower && follower.length === 0 ? (
          <Text style={styles.emptyMessage}>Chưa có ai theo dõi bạn</Text>
        ) : (
          <FlatList
            data={follower || []}
            renderItem={({ item }) => <UserComponent user={item} />}
            keyExtractor={(item) => item._id} // Dùng `_id` thay vì `id`
          />
        )}
      </View>
    </View>
  );
};

export default FollowerScreen;

const styles = StyleSheet.create({
  emptyMessage: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 20,
  },
});
