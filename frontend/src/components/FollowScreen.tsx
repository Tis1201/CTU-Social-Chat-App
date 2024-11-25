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
import { useFollowing } from "../hooks/user/getFollowing";
import UserComponent from "./UserComponent";

const HeaderListFr = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.goBack();
  };

  // Hook lấy dữ liệu
  const { data: following, isLoading, isError } = useFollowing();
  console.log("Following data:", following);

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
          Người bạn theo dõi
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
              Tìm kiếm người bạn theo dõi
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
          {following ? `${following.length} người bạn theo dõi` : "Đang tải..."}
        </Text>
        <Text style={{ color: "blue" }}>Sắp xếp</Text>
      </View>

      {/* Hiển thị danh sách */}
      <View style={{ padding: 15 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : isError ? (
          <Text>Đã xảy ra lỗi khi tải dữ liệu</Text>
        ) : (
          <FlatList
            data={following || []}
            renderItem={({ item }) => <UserComponent user={item} />}
            keyExtractor={(item) => item._id} // Dùng `_id` thay vì `id`
          />
        )}
      </View>
    </View>
  );
};

export default HeaderListFr;

const styles = StyleSheet.create({});
