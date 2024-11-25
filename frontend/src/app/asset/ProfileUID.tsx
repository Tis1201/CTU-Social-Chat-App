import {
  StyleSheet,
  SafeAreaView,
  Platform,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useMemo, useState, useEffect } from "react";

import emotions from "../../../assets/emotion/emotion.json";
import { ImageSourcePropType } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import PostUserId from "../../components/PostUserId";
import { Image } from "expo-image";
import LinkProfileAvt from "../../components/LinkProfileAvt";
import LinkDetailProfile from "../../components/LinkDetailProfile";
import { useLocalSearchParams } from "expo-router";
import { useUserPostsId } from "../../hooks/user/userPost";
import { useBehavior } from "../../hooks/user/getBehavior";

const imageMapping: { [key: string]: ImageSourcePropType } = {
  "../assets/img/console.png": require("../../../assets/img/console.png"),
  "../assets/img/sport.png": require("../../../assets/img/sport.png"),
  "../assets/img/wechat.png": require("../../../assets/img/wechat.png"),
  "../assets/img/tinder.png": require("../../../assets/img/tinder.png"),
  "../assets/img/food.png": require("../../../assets/img/food.png"),
  "../assets/img/gym.png": require("../../../assets/img/gym.png"),
  "../assets/img/cinema.png": require("../../../assets/img/cinema.png"),
  "../assets/img/thinking.png": require("../../../assets/img/thinking.png"),
  // add other icons if needed
};

const ProfileUID = () => {
  const [thinking, setthinking] = useState(0);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const emotion = emotions[thinking];
  const filteredEmotions = useMemo(() => emotions.slice(0), []);
  const uid = useLocalSearchParams();
  const { data: behavior } = useBehavior(
    Array.isArray(uid.uid) ? uid.uid[0] : uid.uid
  );
  const { data: userPostsId } = useUserPostsId(
    Array.isArray(uid.uid) ? uid.uid[0] : uid.uid
  ); // Use hook to fetch posts

  useEffect(() => {
    if (typeof behavior === "number") {
      setthinking(behavior);
    } else if (behavior === undefined) {
      console.log("Behavior data is not yet loaded.");
    } else {
      console.error("Invalid behavior value:", behavior);
    }
  }, [behavior]); // chỉ dùng behavior trong dependency array

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <FlashList
          data={userPostsId && userPostsId.posts ? userPostsId.posts : []} // Use the fetched user posts data
          renderItem={({ item }: { item: any }) => (
            <PostUserId post={item} onHidePost={() => {}} />
          )} // Pass the post item to PostUserId component
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) =>
            item._id ? item._id.toString() : Math.random().toString()
          } // Tạo key cho mỗi item
          onEndReachedThreshold={0.3}
          ListHeaderComponent={
            <>
              <LinkProfileAvt
                uid={typeof uid.uid === "string" ? uid.uid : uid.uid.join(", ")}
              />
              <LinkDetailProfile
                uid={typeof uid.uid === "string" ? uid.uid : uid.uid.join(", ")}
              />

              <TouchableOpacity style={{ alignSelf: "flex-start" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 10,
                    height: 40,
                    backgroundColor: emotion.color_rgba,
                    borderRadius: 14,
                    marginLeft: 15,
                    marginTop: 10,
                    flexShrink: 1,
                    alignSelf: "flex-start",
                  }}
                >
                  <Image
                    source={imageMapping[emotion.icon]} // Tải ảnh dựa trên đường dẫn từ JSON
                    style={{
                      width: 20,
                      height: 20,
                    }}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                  <View
                    style={{
                      flexShrink: 1,
                      maxWidth: "100%",
                    }}
                  >
                    <Text
                      style={{
                        color: "gray",
                        fontSize: 15,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {emotion.emotion}
                    </Text>
                  </View>
                  <Image
                    source={require("../../../assets/img/next.png")}
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: "gray",
                    }}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                </View>
              </TouchableOpacity>

              <View
                style={{
                  paddingTop: 20,
                  paddingLeft: 10,
                  paddingBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 75,
                    height: 30,
                    alignItems: "center",
                    backgroundColor: "rgba(219, 219, 219, 0.8)",
                    justifyContent: "center",
                    borderRadius: 24,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    Bài viết
                  </Text>
                </View>
              </View>
            </>
          }
          estimatedItemSize={200}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ProfileUID;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 45 : 0,
  },
  img: {
    width: 140,
    height: 140,
    borderRadius: 100,
  },
});
