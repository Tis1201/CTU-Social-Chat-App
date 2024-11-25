import React, { useState } from "react";
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
  ScrollView,
} from "react-native";
import { Image } from "expo-image"; // Sử dụng Image từ expo-image
import { useRouter } from "expo-router";
import { saveToken } from "../utils/secureStore";
import { localhost } from "../constants/localhost";

const login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${localhost}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await saveToken(data.accessToken);
        router.replace("/(tabs)");
      } else {
        alert(
          "Login Failed: " + (data.message || "An error occurred during login.")
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Network Error: Unable to connect to the server. Please check your internet connection and try again."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Image
              source={require("../../../assets/img/gif_login.gif")}
              style={{ width: "100%", height: 300 }}
              contentFit="cover" // Đảm bảo hình ảnh vừa khung
            />
            <View style={{ paddingBottom: 20 }}>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  marginTop: 20,
                  marginLeft: 20,
                }}
              >
                Khởi đầu hành trình mới
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "300",
                  marginTop: 5,
                  marginLeft: 30,
                  color: "gray",
                }}
              >
                Kết bạn bốn phương với CTU Social
              </Text>
            </View>
            <View style={{ padding: 10, margin: 10, gap: 10 }}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Tài khoản
              </Text>
              <TextInput
                placeholder="nhập địa chỉ email của bạn"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  height: 50,
                  width: "90%",
                  padding: 10,
                  borderRadius: 10,
                }}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
            <View style={{ padding: 10, margin: 10, gap: 10 }}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>Mật khẩu</Text>
              <TextInput
                placeholder="nhập mật khẩu của bạn"
                secureTextEntry={!showPassword}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  height: 50,
                  width: "90%",
                  padding: 10,
                  borderRadius: 10,
                  position: "relative",
                }}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={
                    showPassword
                      ? require("../../../assets/img/view.png")
                      : require("../../../assets/img/hide.png")
                  }
                  style={{
                    width: 20,
                    height: 20,
                    position: "absolute",
                    top: -43,
                    right: 55,
                  }}
                />
              </TouchableOpacity>
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
                onPress={handleLogin}
              >
                <Text
                  style={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}
                >
                  Đăng nhập
                </Text>
              </TouchableOpacity>
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Bạn chưa có tài khoản?{" "}
                <Text
                  style={{ color: "#2980b8", fontWeight: "bold" }}
                  onPress={() => router.push("/(auth)/register")}
                >
                  Hãy đăng ký
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: Platform.OS === "android" ? 45 : 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
