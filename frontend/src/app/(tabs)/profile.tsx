import {
  StyleSheet,
  SafeAreaView,
  Platform,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import ProfileAvtBg from "../../components/ProfileAvtBg";
import DetailProfile from "../../components/DetailProfile";
import emotions from "../../../assets/emotion/emotion.json";
import { ImageSourcePropType } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { setSelectedId } from "../../../redux/userSlice";
import { FlashList } from "@shopify/flash-list";
import PostUserId from "../../components/PostUserId";
import { Image } from "expo-image";
import {
  getBehaviorFromToken,
  getToken,
} from "../utils/secureStore";
import { localhost } from "../constants/localhost";
import { useUserPosts } from "../../hooks/fetchUserPost"; // Import the hook

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

const Profile = () => {
  const [thinking, setthinking] = useState(0);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const emotion = emotions[thinking];
  const filteredEmotions = useMemo(() => emotions.slice(0), []);
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const { data: userPosts } = useUserPosts(); // Use hook to fetch posts

  const dispatch = useDispatch();



  function handlePresentModal() {
    setIsBottomSheetVisible(true);
    bottomSheetModalRef.current?.expand();
  }

  const handleDismiss = () => {
    bottomSheetModalRef.current?.close();
    setTimeout(() => {
      setIsBottomSheetVisible(false);
      console.log("Bottom Sheet was dismissed");
    }, 500); // Increased delay to 1000ms (1 second) for a slower dismissal
  };

  const handlePress = (id: number) => {
    // Cập nhật thinking và dispatch action
    setthinking(id); // Hoặc bất kỳ giá trị nào bạn muốn cập nhật thinking
    console.log("Dispatching ID:", id);
    dispatch(setSelectedId(id));
    handleDismiss();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        // disappearsOnIndex={1}
        // appearsOnIndex={2}
        onPress={handleDismiss}
      />
    ),
    []
  );
  React.useEffect(() => {
    const fetchBehavior = async () => {
      const behavior = await getBehaviorFromToken();
      // console.log('Behavior:', typeof(behavior));
      if (typeof behavior === "number") {
        setthinking(behavior);
        dispatch(setSelectedId(behavior));
      } else {
        console.error("Invalid behavior value:", behavior);
      }
    };
    fetchBehavior();
  }, [Profile]);
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <BottomSheetModalProvider>
          <FlashList
            data={userPosts && userPosts.posts ? userPosts.posts : []} // Use the fetched user posts data
            renderItem={({ item } : { item: any }) => <PostUserId post={item} />} // Pass the post item to PostUserId component
            showsVerticalScrollIndicator={false}
            keyExtractor={(item: any) => item._id ? item._id.toString() : Math.random().toString()} // Tạo key cho mỗi item
            onEndReachedThreshold={0.3}
            ListHeaderComponent={
              <>
                <ProfileAvtBg />
                <DetailProfile />
                <TouchableOpacity
                  onPress={handlePresentModal}
                  style={{ alignSelf: "flex-start" }}
                >
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
          {isBottomSheetVisible && (
            <BottomSheet
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              backgroundStyle={{ backgroundColor: "white" }}
              backdropComponent={renderBackdrop}
              enablePanDownToClose
              onClose={handleDismiss}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <FlatList
                  data={filteredEmotions}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={async () => {
                        handlePress(item.id);
                        try {
                          const token = await getToken();
                          // await setCacheBehavior(item.id);
                          if (!token) {
                            throw new Error("No token available");
                          }
                          const response = await fetch(
                            `${localhost}/users/behavior`,
                            {
                              method: "PATCH",
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                                "Accept-Encoding": "gzip, deflate, br",
                              },
                              body: JSON.stringify({ behavior: item.id }),
                            }
                          );
                          if (!response.ok) {
                            throw new Error("Failed to update behavior");
                          }
                          // Handle successful update if needed
                        } catch (error) {
                          console.error("Error updating behavior:", error);
                          // Handle error (e.g., show an alert to the user)
                        }
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 20,
                            height: 80,
                            backgroundColor: item.color_rgba,
                            borderRadius: 14,
                            marginTop: 15,
                            width: Platform.OS === "ios" ? 330 : 380,
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={imageMapping[item.icon]} // Truy cập icon từ đối tượng item
                            style={{
                              width: 30,
                              height: 30,
                            }}
                            contentFit="contain"
                            cachePolicy="memory-disk"
                          />
                          <View
                            style={{
                              maxWidth: "100%",
                            }}
                          >
                            <Text
                              style={{
                                color: "gray",
                                fontSize: 20,
                              }}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.emotion}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()} // Tạo key duy nhất cho mỗi item
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 10,
                  }}
                  // estimatedItemSize={200}
                />
              </View>
            </BottomSheet>
          )}
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Profile;

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
