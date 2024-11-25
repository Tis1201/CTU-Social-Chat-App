import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { useUname } from "../hooks/user/fetchUname";
import { useFollow } from "../hooks/follow/fetchFollow";
import { useCheckFollow } from "../hooks/follow/checkFollow";
import { useAddFollow } from "../hooks/follow/addFollow";
import { useDeleteFollow } from "../hooks/follow/deleteFollower";
import { getUserIdFromToken } from "../app/utils/secureStore";

interface User {
  id: string;
  full_name: string;
  gender: string;
  bio: string;
  avatar_url: string;
  behavior: number;
}

interface Id {
  uid: string;
}

const LinkDetailProfile = ({ uid }: Id) => {
  useEffect(() => {
    const fetchUid = async () => {
      const uid = await getUserIdFromToken();
      setUserId(uid || "");
    };
    fetchUid();
  }, []);
  const { data: user, isLoading: isUserLoading } = useUname(uid);
  const [userId, setUserId] = useState("");
  const {
    data: follow,
    isLoading: isFollowLoading,
    refetch: refetchFollow,
  } = useFollow(uid);
  const {
    data: checkFollow,
    refetch: refetchCheckFollow,
    isLoading: isCheckFollowLoading,
  } = useCheckFollow(uid);

  const [isFollowing, setIsFollowing] = useState(false);
  const widthScreen = useWindowDimensions().width;

  const { mutate: addFollow } = useAddFollow();
  const { mutate: deleteFollow } = useDeleteFollow();

  const handleFollow = () => {
    addFollow(uid, {
      onSuccess: () => {
        setIsFollowing(true);
        refetchCheckFollow(); // Refetch lại trạng thái theo dõi sau khi thành công
        refetchFollow(); // Cập nhật lại số lượng người theo dõi và đang theo dõi
      },
      onError: (error) => {
        console.error("Failed to follow:", error);
      },
    });
  };

  const handleUnfollow = () => {
    deleteFollow(uid, {
      onSuccess: () => {
        setIsFollowing(false);
        refetchCheckFollow(); // Refetch lại trạng thái theo dõi sau khi bỏ theo dõi
        refetchFollow(); // Cập nhật lại số lượng người theo dõi và đang theo dõi
      },
      onError: (error) => {
        console.error("Failed to unfollow:", error);
      },
    });
  };

  const formatNumber = (number: number): string => {
    if (number >= 1000) {
      const formattedNumber = (number / 1000).toFixed(1);
      return formattedNumber.endsWith(".0")
        ? `${Math.floor(parseFloat(formattedNumber))}k`
        : `${formattedNumber}k`;
    }
    return number.toString();
  };

  // Kiểm tra trạng thái loading của tất cả các hook liên quan
  const isLoading = isUserLoading || isFollowLoading || isCheckFollowLoading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ADD8E6" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.userName}>{user?.user?.full_name}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {uid !== userId && (
          <>
            {checkFollow ? (
              <>
                <TouchableOpacity style={styles.followingButton}>
                  <Text style={styles.followingButtonText}>Đang theo dõi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.unfollowButton}
                  onPress={handleUnfollow}
                >
                  <Text style={styles.unfollowButtonText}>Bỏ theo dõi</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.followButton}
                onPress={handleFollow}
              >
                <Text style={styles.followButtonText}>Theo dõi</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Thông tin login/logout */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBlock}>
          <Image
            source={require("../../assets/img/log-out.png")}
            style={styles.icon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Text>{formatNumber(follow.followers)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoBlock}>
          <Image
            source={require("../../assets/img/log-in.png")}
            style={styles.icon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Text>{formatNumber(follow.following)}</Text>
        </View>
      </View>

      <Text style={styles.detailText}>Chi tiết</Text>
    </View>
  );
};

export default LinkDetailProfile;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 55,
    paddingLeft: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 20,
    paddingBottom: 7,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    gap: 10,
  },
  followButton: {
    backgroundColor: "#ADD8E6",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  followingButton: {
    backgroundColor: "#cce5ff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followingButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  unfollowButton: {
    backgroundColor: "#f8d7da",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  unfollowButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginLeft: Platform.OS === "ios" ? 30 : 40,
    paddingBottom: 10,
  },
  infoBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  icon: {
    width: 15,
    height: 15,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#E0E0E0",
  },
  detailText: {
    fontWeight: "bold",
    fontSize: 17,
    paddingLeft: 10,
  },
});
