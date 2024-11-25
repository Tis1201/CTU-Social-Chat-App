import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <SafeAreaView style={styles.container}>
          <View style={{ paddingBottom: 20 }}>
            <Text
              style={{
                fontSize: 25,
                fontWeight: "bold",
                marginTop: 20,
                marginLeft: 20,
              }}
            >
              Cập nhật thông tin cá nhân
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "light",
                marginTop: 5,
                marginLeft: 30,
                color: "gray",
              }}
            >
              Cập nhập thông tin cá nhân
            </Text>
          </View>
          <View style={{ padding: 10, margin: 10, gap: 10 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>
              Tên hiển thị
            </Text>
            <TextInput
              placeholder="nhập tên hiển thị của bạn"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                height: 50,
                width: "90%",
                padding: 10,
                borderRadius: 10,
              }}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={{ padding: 10, margin: 10, gap: 10 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Bio</Text>
            <TextInput
              placeholder="nhập bio của bạn"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                height: 50,
                width: "90%",
                padding: 10,
                borderRadius: 10,
                position: "relative",
              }}
              value={bio}
              onChangeText={(text) => setBio(text)}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#2980b8",
                padding: 10,
                borderRadius: 10,
                width: "90%",
                alignItems: "center",
                marginTop: 10,
              }}
              activeOpacity={0.9}
            >
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}>
                Cập nhập
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 45 : 0,
  },
});
