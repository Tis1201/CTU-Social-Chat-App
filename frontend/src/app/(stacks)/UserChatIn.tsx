import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Channel,
  MessageList,
  MessageInput,
  DefaultStreamChatGenerics,
  OverlayProvider,
  Chat,
} from "stream-chat-expo";
import { StreamChat, Channel as ChannelType } from "stream-chat";
import { localhost } from "../constants/localhost";
import moment from "moment";

const UserChatIn = () => {
  const { width, height } = Dimensions.get("window");
  const router = useRouter();
  const { channelId } = useLocalSearchParams();
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [user, setUser] = useState<any>(null);
  const API_KEY = "bde7bhtputfm";
  const client = StreamChat.getInstance<DefaultStreamChatGenerics>(API_KEY);

  const goBack = () => {
    router.back();
  };

  const getLastActiveText = (lastActive: any) => {
    if (!lastActive) return "Chưa từng hoạt động"; // Nếu `lastActive` là null
    return `Hoạt động lần cuối ${moment(lastActive).fromNow()}`;
  };

  useEffect(() => {
    const initChannel = async () => {
      try {
        const validChannelId = Array.isArray(channelId)
          ? channelId[0]
          : channelId;

        if (validChannelId) {
          const newChannel = client.channel("messaging", validChannelId);
          await newChannel.watch();
          setChannel(newChannel);

          // Lấy thông tin người dùng từ channel
          const members = newChannel.state.members;
          const otherUser = Object.values(members).find(
            (member) => member.user_id !== client.userID
          );
          if (otherUser?.user) {
            setUser({
              ...otherUser.user,
              isOnline: otherUser.user.online,
              last_active: otherUser.user.last_active,
            });
          }
        }
      } catch (error) {
        console.error("Error initializing channel:", error);
      }
    };

    initChannel();

    return () => {
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [channelId]);

  if (!channel || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const avatarUrl = user.image?.startsWith("http")
    ? user.image
    : user.image
      ? `${localhost}${user.image.replace(/\\/g, "/")}`
      : "https://th.bing.com/th/id/OIP.pdgwLL8oxjSs9n4AV66x5wHaHa?rs=1&pid=ImgDetMain";

  console.log("User online status:", user.isOnline);
  console.log("User last active:", user.last_active);

  return (
    <OverlayProvider>
      <Chat client={client}>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Pressable onPress={goBack}>
                <Image
                  source={require("../../../assets/img/left-arrow.png")}
                  style={styles.backIcon}
                  resizeMode="contain"
                />
              </Pressable>
              <View style={styles.userInfo}>
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                <View>
                  <Text style={styles.userName}>{user.name || user.id}</Text>
                  <Text style={styles.status}>
                    {user.isOnline
                      ? "Đang hoạt động"
                      : getLastActiveText(user.last_active)}
                  </Text>
                </View>
              </View>
            </View>
            <Image
              source={require("../../../assets/img/menu.png")}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </View>

          {/* Chat Area */}
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={0}
            style={{
              backgroundColor: "white",
              flex: 1,
              height: (height * 3) / 4,
            }}
          >
            <Channel channel={channel}>
              <MessageList />
              <MessageInput />
            </Channel>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Chat>
    </OverlayProvider>
  );
};

export default UserChatIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 45 : 0,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    gap: 30,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 15,
    paddingBottom: 2,
  },
  status: {
    fontSize: 11,
    color: "gray",
  },
  menuIcon: {
    width: 25,
    height: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
