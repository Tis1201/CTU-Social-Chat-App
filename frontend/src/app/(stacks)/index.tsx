import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  TextInput,
} from "react-native";
import React from "react";
import UserChatOut from "../../components/UserChatOut";

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <UserChatOut />
    </SafeAreaView>
  );
};

export default index;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    paddingTop: Platform.OS === "android" ? 45 : 0,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlign: "center",
  },
});
