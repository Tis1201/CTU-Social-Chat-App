import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { getUserIdFromToken } from "../app/utils/secureStore";
import { Image } from "expo-image";
import { localhost } from "../app/constants/localhost";
import * as Notifications from "expo-notifications";
import { NotificationTriggerInput } from "expo-notifications";

interface Channel {
  id: string;
  watch(): Promise<void>;
  queryMembers(
    filter: { user_id?: string },
    sort: any,
    options: {}
  ): Promise<{
    members: {
      user?: {
        name: string;
        id: string;
        image: string | null;
      };
      user_id: string;
    }[];
  }>;
  state: {
    messages: any[];
    unreadCount: number;
  };
  on(event: string, callback: (event: any) => void): void;
  off(event: string, callback: (event: any) => void): void;
  markRead(): void;
  client: {
    user: {
      id: string;
    };
  };
}

const CustomChannelPreview = ({ channel }: { channel: Channel }) => {
  const [loading, setLoading] = useState(true);
  const [otherUserName, setOtherUserName] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const router = useRouter();
  const widthWindow = useWindowDimensions().width;

  useEffect(() => {
    const fetchMembersAndWatch = async () => {
      const uid = await getUserIdFromToken();
      if (!uid) {
        console.error("User ID is null");
        setLoading(false);
        return;
      }

      setCurrentId(uid);
      try {
        await channel.watch();
        const sort = {};
        const result = await channel.queryMembers({}, sort, {});

        const otherParticipant = result.members.find(
          (member) => member.user_id !== uid
        );

        if (otherParticipant && otherParticipant.user_id) {
          const userId = otherParticipant.user_id;
          const memberResult = await channel.queryMembers(
            { user_id: userId },
            sort,
            {}
          );

          if (memberResult.members.length > 0) {
            const fetchedUser = memberResult.members[0].user;
            if (fetchedUser) {
              setOtherUserName(fetchedUser.name);
              setAvatar(fetchedUser.image);
            }
          }
        }

        // Khởi tạo số lượng tin nhắn chưa đọc cho người dùng
        setUnreadCounts({ [uid]: channel.state.unreadCount });

        const handleNewMessage = (event: any) => {
          if (event.message && event.message.user.id !== uid) {
            setUnreadCounts((prev) => ({
              ...prev,
              [uid]: (prev[uid] || 0) + 1, // Tăng số lượng tin nhắn chưa đọc cho người dùng hiện tại
            }));
            sendLocalNotification(event.message);
          }
        };

        channel.on("message.new", handleNewMessage);

        const handleMessageRead = (event: any) => {
          if (event.user.id === uid) {
            setUnreadCounts((prev) => ({ ...prev, [uid]: 0 })); // Reset số lượng tin nhắn chưa đọc khi đã đọc
          }
        };

        channel.on("message.read", handleMessageRead);

        return () => {
          channel.off("message.new", handleNewMessage);
          channel.off("message.read", handleMessageRead);
        };
      } catch (error) {
        console.error("Error fetching members or watching channel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembersAndWatch();
  }, [channel]);

  const lastMessage =
    channel.state.messages.length > 0
      ? channel.state.messages[channel.state.messages.length - 1]
      : null;

  const formattedTime = lastMessage?.created_at
    ? new Date(lastMessage.created_at).toLocaleTimeString()
    : "Không có thời gian";

  const handlePress = () => {
    router.push({
      pathname: "/UserChatIn",
      params: { channelId: channel.id },
    });

    channel.markRead();
    if (currentId) {
      // Kiểm tra xem currentId có phải là null không
      setUnreadCounts((prev) => ({ ...prev, [currentId]: 0 })); // Reset số lượng tin nhắn chưa đọc cho người dùng hiện tại
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  const avatarBaseUrl = localhost;
  const avatarUrl =
    avatar && typeof avatar === "string" && avatar.startsWith("http")
      ? avatar
      : avatar && typeof avatar === "string"
        ? `${avatarBaseUrl}/${avatar.replace(/\\/g, "/")}`
        : "";

  // Debugging log
  console.log("Avatar URL:", avatarUrl);
  const isCurrentUser = lastMessage?.user?.id === currentId;

  const lastMessageText = isCurrentUser
    ? `you: ${lastMessage?.text}`
    : lastMessage?.text;

  const unreadCount = currentId ? unreadCounts[currentId] || 0 : 0;

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          source={{ uri: avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 20,
            alignItems: "center",
          }}
        >
          <View style={{ gap: 8 }}>
            <Text style={styles.userName}>{otherUserName}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Text
                style={[
                  styles.lastMessage,
                  unreadCount > 0 && styles.boldLastMessage,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {lastMessageText}
              </Text>
              <Text style={styles.messageTime}>• {formattedTime}</Text>
            </View>
          </View>
          <View style={{ left: widthWindow - 330 }}>
            {unreadCount > 0 && (
              <View style={styles.unreadCountContainer}>
                <Text style={styles.unreadCountText}>
                  {unreadCount > 5 ? "5+" : unreadCount.toString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const sendLocalNotification = (message: any) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: `New message from ${message.user.name}`,
      body: message.text || "You have a new message",
    },
    trigger: {
      type: "timeInterval", // Specify the type
      seconds: 1, // Trigger after 1 second
      repeats: false, // Set whether it should repeat
    } as NotificationTriggerInput,
  });
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
  },
  lastMessage: {
    color: "#666",
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    alignSelf: "flex-end",
  },
  loaderContainer: {
    padding: 10,
    alignItems: "center",
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 100,
  },
  unreadCountContainer: {
    backgroundColor: "#ff3b30",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  boldLastMessage: {
    fontWeight: "bold",
    color: "#333",
  },
});

export default CustomChannelPreview;
