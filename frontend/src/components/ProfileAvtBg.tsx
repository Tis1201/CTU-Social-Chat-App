import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getAvatarUrlFromToken } from "../app/utils/secureStore";
import { localhost } from "../app/constants/localhost";
const ProfileAvtBg = () => {
  const widthScreen = useWindowDimensions().width;
  const avatarBaseUrl = localhost;
  const [avatarUrl, setAvatarUrl] = React.useState("");

  React.useEffect(() => {
    const fetchAvatarUrl = async () => {
      const avt = await getAvatarUrlFromToken();
      if (avt) {
        const url = `${avatarBaseUrl}/${avt.replace(/\\/g, '/')}`;
        setAvatarUrl(url);
      } else {
        console.log("Avatar token is null");
      }
    };
    fetchAvatarUrl();
  }, []);

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
          source={avatarUrl}
          style={styles.img}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </View>

      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "white",
          borderRadius: 100,
          position: "absolute",
          top: 185,
          left: 130,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 35,
            height: 35,
            backgroundColor: "rgba(219, 219, 219, 0.8)",
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/img/camera.png")}
            contentFit="contain"
            cachePolicy="memory-disk"
            style={{
              width: 20,
              height: 20,
            }}
          />
        </View>
      </View>
      <View
        style={{
          width: 40,
          height: 40,
          backgroundColor: "white",
          borderRadius: 100,
          position: "absolute",
          top: 150,
          right: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 35,
            height: 35,
            backgroundColor: "rgba(219, 219, 219, 0.8)",
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../assets/img/camera.png")}
            contentFit="contain"
            cachePolicy="memory-disk"
            style={{
              width: 20,
              height: 20,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileAvtBg;

const styles = StyleSheet.create({
  img: {
    width: 140,
    height: 140,
    borderRadius: 100,
  },
});
