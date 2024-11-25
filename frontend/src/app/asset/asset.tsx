import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";

const Asset = () => {
  const { mediaUrl } = useLocalSearchParams(); // Lấy mediaUrl từ query parameter
  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: Platform.OS === "ios" ? 50 : 70,
          right: 20,
          zIndex: 1,
          padding: 10,
        }}
      >
        <Image
          source={require("../../../assets/img/close.png")}
          style={{ width: 18, height: 18 }}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      </Pressable>
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {typeof mediaUrl === "string" && (
          <Image
            source={{ uri: mediaUrl }}
            style={{ width: screenWidth, height: "85%" }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Asset;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    paddingTop: Platform.OS === "android" ? 45 : 0,
    flex: 1,
  },
});
