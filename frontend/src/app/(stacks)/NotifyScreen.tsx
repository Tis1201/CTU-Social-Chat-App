import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Notification from "../../components/Notification";

const NotifyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Notification />
    </SafeAreaView>
  );
};

export default NotifyScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 45 : 0,
    flex: 1,
  },
});
