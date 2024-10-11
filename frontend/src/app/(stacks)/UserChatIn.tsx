import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Pressable,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import BodyChat from "../../components/BodyChat";
import InputChat from "../../components/InputChat";

const UserChatIn = () => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 25,
            paddingLeft: 20,
          }}
        >
          <Pressable onPress={goBack}>
            <Image
              source={require("../../../assets/img/left-arrow.png")}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <Image
              source={{
                uri: "https://th.bing.com/th/id/OIP.M6TAuNj3gyT6sh4QXLK8yQHaJQ?w=178&h=223&c=7&r=0&o=5&pid=1.7",
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
              }}
              resizeMode="cover"
            />
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    paddingBottom: 2,
                  }}
                >
                  Thùy Trang
                </Text>
                <Image
                  source={require("../../../assets/img/black-circle.png")}
                  style={{
                    width: 11,
                    height: 11,
                  }}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={{
                  fontSize: 13,
                  color: "gray",
                }}
              >
                Đang hoạt động
              </Text>
            </View>
          </View>
        </View>
        <Image
          source={require("../../../assets/img/menu.png")}
          style={{
            width: 25,
            height: 25,
          }}
          resizeMode="contain"
        />
      </View>
      <BodyChat />
      <InputChat />
    </SafeAreaView>
  );
};

export default UserChatIn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(183, 170, 177, 0.04)",
    paddingTop: Platform.OS === "android" ? 45 : 0,
  },
});
