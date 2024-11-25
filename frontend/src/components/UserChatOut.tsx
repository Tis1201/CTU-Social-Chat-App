import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  Text,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  StreamChat,
  ChannelFilters,
  Channel as ChannelType,
} from "stream-chat";
import { OverlayProvider, Chat, ChannelList } from "stream-chat-expo";
import { debounce } from "lodash";
import CustomChannelPreview from "./ChannelListChat";

const API_KEY = "bde7bhtputfm";
const client = StreamChat.getInstance(API_KEY);

const UserChatOut = () => {
  const router = useRouter();
  const [isUserConnecting, setIsUserConnecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ChannelFilters>({
    members: { $in: [client.user?.id || ""] },
  });

  const handleSearch = debounce((query: string) => {
    if (query) {
      setFilters({
        members: { $in: [client.user?.id || ""] },
        name: { $autocomplete: query },
      });
    } else {
      setFilters({ members: { $in: [client.user?.id || ""] } });
    }
  }, 300);

  useEffect(() => {
    handleSearch(searchQuery);

    return () => {
      handleSearch.cancel();
    };
  }, [searchQuery]);

  const handleChannelPress = async (channel: ChannelType) => {
    try {
      router.push({
        pathname: "/(stacks)/UserChatIn",
        params: { channelId: channel.id },
      });
    } catch (error) {
      console.error("Lỗi khi xử lý channel press:", error);
    }
  };

  return (
    <OverlayProvider>
      <Chat client={client}>
        <View style={styles.container}>
          <View>
            <Text style={styles.headerText}>Đoạn chat</Text>
          </View>
          <View
            style={{
              width: "100%",
              padding: 15,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(219, 219, 219, 0.8)",
                borderRadius: 25,
                flexDirection: "row",
                height: 40,
                alignItems: "center",
                gap: 10,
                paddingLeft: 15,
              }}
            >
              <Image
                source={require("../../assets/img/search-chat.png")}
                style={{
                  width: 23,
                  height: 23,
                  resizeMode: "contain",
                }}
              />
              <TextInput
                style={{
                  color: "gray",
                  fontSize: 17,
                }}
                placeholder="Tìm kiếm"
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
              />
            </View>
          </View>
          {isUserConnecting ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ChannelList
              onSelect={(channel) => handleChannelPress(channel)}
              filters={filters}
              sort={{ last_message_at: -1 }}
              Preview={CustomChannelPreview as any}
            />
          )}
        </View>
      </Chat>
    </OverlayProvider>
  );
};

export default UserChatOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },

  headerText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
});
