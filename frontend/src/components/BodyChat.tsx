import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

const BodyChat = () => {
  const { width, height } = Dimensions.get("window");
  return (
    <View
      style={{
        height: (height * 4) / 5,
        backgroundColor: "white",
      }}
    >
      <Text>BodyChat</Text>
    </View>
  );
};

export default BodyChat; 

const styles = StyleSheet.create({});
