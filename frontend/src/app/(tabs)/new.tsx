import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import SuggestFeed from "../../components/SuggestFeed";
import NewestFeed from "../../components/NewestFeed";
import FollowFeed from "../../components/FollowFeed";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import PostFeed from "../../components/PostFeed";
const NewFeed = () => {
  // State để lưu tab hiện tại
  const [selectedTab, setSelectedTab] = useState("Gợi ý");
  const router = useRouter();
  const handlePress = () => {
    router.push("/(stacks)/NotifyScreen"); // Use router.push to navigate
  };

  const handlePostFeed = () => {
    router.push("/(stacks)/PostScreen");
  };
  const renderContent = () => {
    switch (selectedTab) {
      case "Theo dõi":
        return <FollowFeed />; // Thay thế bằng component của Theo dõi
      case "Gợi ý":
        return <SuggestFeed />;
      case "Mới nhất":
        return <NewestFeed />; // Thay thế bằng component của Mới nhất
      default:
        return <SuggestFeed />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabs}>
          {/* Tab Theo dõi */}
          <TouchableOpacity onPress={() => setSelectedTab("Theo dõi")}>
            <Text
              style={[
                styles.text,
                { color: selectedTab === "Theo dõi" ? "black" : "#D8D5D5" },
                { fontSize: selectedTab === "Theo dõi" ? 25 : 20 },
              ]}
            >
              Theo dõi
            </Text>
          </TouchableOpacity>
          {/* Tab Gợi ý */}
          <TouchableOpacity onPress={() => setSelectedTab("Gợi ý")}>
            <Text
              style={[
                styles.text,
                { color: selectedTab === "Gợi ý" ? "black" : "#D8D5D5" },
                { fontSize: selectedTab === "Gợi ý" ? 25 : 20 },
              ]}
            >
              Gợi ý
            </Text>
          </TouchableOpacity>
          {/* Tab Mới nhất */}
          <TouchableOpacity onPress={() => setSelectedTab("Mới nhất")}>
            <Text
              style={[
                styles.text,
                { color: selectedTab === "Mới nhất" ? "black" : "#D8D5D5" },
                { fontSize: selectedTab === "Mới nhất" ? 25 : 20 },
              ]}
            >
              Mới nhất
            </Text>
          </TouchableOpacity>
        </View>
        <Pressable onPress={handlePress}>
          <Image
            source={require("../../../assets/img/bell-ring-nofill.png")}
            style={styles.bellIcon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </Pressable>
      </View>

      {/* Render nội dung dựa trên tab đã chọn */}
      {renderContent()}
      <Pressable onPress={handlePostFeed}>
        <Image
          source={require("../../../assets/img/plus1.png")}
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            right: 20,
            position: "absolute",
            bottom: Platform.OS === "android" ? 370 : 300,
          }}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default NewFeed;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 45 : 0,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    position: "relative",
  },
  tabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "light",
  },
  bellIcon: {
    width: 22,
    height: 22,
    tintColor: "black",
  },
});
