import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PostFeed from "../../components/PostFeed";

const PostScreen = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <PostFeed />
    </View>
  );
};

export default PostScreen;
const styles = StyleSheet.create({});
