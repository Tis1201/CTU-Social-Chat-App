import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getToken, getUserIdFromToken, logout } from "../app/utils/secureStore";
import { Image } from "expo-image";
import { localhost } from "../app/constants/localhost";

interface User {
  id: string; // Change from id to _id
  full_name: string;
  gender: string;
  bio: string;
  avatar_url: string;
  behavior: number;
}

const DetailProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token = await getToken();
    const uid = await getUserIdFromToken();
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

  const widthScreen = useWindowDimensions().width;
  return (
    <View>
      <View
        style={{
          paddingTop: 55,
          paddingLeft: 25,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            paddingBottom: 7,
          }}
        >
          {user?.full_name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
            marginLeft: Platform.OS === "ios" ? 10 : 40,
          }}
        >
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
            <Text>{formatNumber(200)}</Text>
          </View>
          <View
            style={{
              width: 1,
              height: 20,
              backgroundColor: "#E0E0E0",
              // marginHorizontal: 10,
            }}
          />
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
            <Text>{formatNumber(1234)}</Text>
          </View>
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
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 13,
            }}
          >
            Chỉnh sửa thông tin cá nhân
          </Text>
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
          onPress={async () => {
            try {
              await logout();
              // Add navigation to login screen or any other necessary action after logout
            } catch (error) {
              console.error("Error logging out:", error);
            }
          }}
        >
          <Image
            source={require("../../assets/img/option.png")}
            style={{
              width: 25,
              height: 25,
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

const styles = StyleSheet.create({});
