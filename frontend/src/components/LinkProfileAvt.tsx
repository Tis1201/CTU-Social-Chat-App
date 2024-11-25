import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getAvatarUrlFromToken } from "../app/utils/secureStore";
import { localhost } from "../app/constants/localhost";
import { useAvt } from "../hooks/user/fetchAvt";

interface Id {
  uid: string;
}

const LinkProfileAvt = ({ uid }: Id) => {
  const widthScreen = useWindowDimensions().width;
  const avatarBaseUrl = localhost;
  const { data: avatarUrl } = useAvt(uid);

  const url = avatarUrl
    ? `${avatarBaseUrl}/${avatarUrl.replace(/\\/g, "/")}`
    : null;

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
          source={url}
          style={styles.img}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </View>
    </View>
  );
};

export default LinkProfileAvt;

const styles = StyleSheet.create({
  img: {
    width: 140,
    height: 140,
    borderRadius: 100,
  },
});
