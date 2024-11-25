import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getToken, getUserIdFromToken, logout } from "../app/utils/secureStore";
import { Image } from "expo-image";
import { localhost } from "../app/constants/localhost";
import { Link, useRouter } from "expo-router";
import * as Updates from "expo-updates";
import { useFollow } from "../hooks/follow/fetchFollow";
interface User {
  id: string; // Change from id to _id
  full_name: string;
  gender: string;
  bio: string;
  avatar_url: string;
  behavior: number;
}
interface Count {
  followers: number;
  following: number;
}
interface UserDetail {
  user: User;
  count: Count;
}

const DetailProfile = () => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const router = useRouter();
  const fetchUser = async () => {
    const token = await getToken();
    const uid = await getUserIdFromToken();
    setUid(uid);
    if (!token) {
      throw new Error("No token available");
    }
    const response = await fetch(`${localhost}/users/${uid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.json();
    setUser(data);
  };

  const formatNumber = (number: number): string => {
    if (number >= 1000) {
      // Chia số cho 1000 để chuyển thành dạng có k
      const formattedNumber = (number / 1000).toFixed(1);

      // Chuyển đổi chuỗi thành số để sử dụng Math.floor
      const roundedNumber = parseFloat(formattedNumber);

      // Kiểm tra nếu số sau khi làm tròn có dạng .0 thì chỉ giữ lại phần nguyên
      return formattedNumber.endsWith(".0")
        ? `${Math.floor(roundedNumber)}k`
        : `${formattedNumber}k`;
    }

    // Nếu số nhỏ hơn 1000 thì trả về số gốc
    return number.toString();
  };
  const handleLogout = async () => {
    try {
      await logout();
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const showLogoutAlert = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: handleLogout,
      },
    ]);
  };

  const widthScreen = useWindowDimensions().width;
  return (
    <View>
      <View
        style={{
          paddingTop: 55,
          paddingLeft: 25,
          // flexDirection: "row",
          // alignItems: "center",
          justifyContent: "flex-start",
          gap: 20,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            paddingBottom: 7,
          }}
        >
          {user?.user?.full_name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 15,
            // marginLeft: Platform.OS === "ios" ? 10 : 40,
            paddingBottom: 10,
          }}
        >
          <Link href={"/asset/FollowerPage"} asChild>
            <Pressable>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Image
                  source={require("../../assets/img/log-out.png")}
                  style={{ width: 15, height: 15 }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />
                <Text>{formatNumber(user?.count?.followers || 0)}</Text>
              </View>
            </Pressable>
          </Link>
          <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: "#E0E0E0",
              // marginHorizontal: 10,
            }}
          />
          <Link href={"/asset/FollowingPage"} asChild>
            <Pressable>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Image
                  source={require("../../assets/img/log-in.png")}
                  style={{ width: 15, height: 15 }}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />
                <Text>{formatNumber(user?.count?.following || 0)}</Text>
              </View>
            </Pressable>
          </Link>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 20,
          gap: 10,
          width: "100%",
          justifyContent: "center",
          paddingBottom: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: "rgba(219, 219, 219, 0.8)",
            height: 40,
            width: (widthScreen * 3) / 5,
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Image
            source={require("../../assets/img/pen.png")}
            style={{
              width: 16,
              height: 16,
            }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Link href={"/asset/updateProfile"} asChild>
            <Pressable>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                Chỉnh sửa thông tin cá nhân
              </Text>
            </Pressable>
          </Link>
        </View>
        <TouchableOpacity
          style={{
            width: (widthScreen * 1) / 8,
            backgroundColor: "rgba(219, 219, 219, 0.8)",
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
          onPress={showLogoutAlert}
        >
          <Image
            source={require("../../assets/img/logout3.png")}
            style={{
              width: 20,
              height: 20,
            }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontWeight: "bold",
          fontSize: 17,
          paddingLeft: 10,
        }}
      >
        Chi tiết{" "}
      </Text>
    </View>
  );
};

export default DetailProfile;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
