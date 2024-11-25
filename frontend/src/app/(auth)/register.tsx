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
  Alert,
  ScrollView,
} from "react-native";
import { Image } from "expo-image"; // Sử dụng Image từ expo-image
import { useRouter } from "expo-router";
import ModalSelector from "react-native-modal-selector";
import useRegister from "../../hooks/user/register";
import { saveToken } from "../utils/secureStore";

const register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("nam");
  const [username, setUsername] = useState("");
  const [full_name, setFull_name] = useState("");
  const [age, setAge] = useState("");
  const { mutate: register } = useRegister();
  const router = useRouter();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const genderOptions = [
    { key: "nam", label: "Nam" },
    { key: "nữ", label: "Nữ" },
  ];
  const handleRegister = () => {
    const avatar_url = "https://runningcalendar.co.za/images/Blank-Avatar.jpg";
    const bio = "";
    const location = {
      coordinates: [-74.006, 40.7128],
    };
    const payload = {
      email,
      password,
      username,
      full_name,
      avatar_url,
      bio,
      gender,
      age,
      location,
    };
    console.log(payload);
    register(payload, {
      onSuccess: async (data) => {
        Alert.alert("Success", "Registration successful!");
        const { accessToken } = data;
        if (accessToken) {
          await saveToken(accessToken);
          Alert.alert("Success", "Registration successful!");
          router.push("/SetAvt");
        } else {
          Alert.alert("Error", "Access token is missing in the response.");
        }
      },
      onError: (error) => {
        Alert.alert("Error", error.message); // Hiển thị lỗi từ phía API hoặc lỗi khác
      },
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={dismissKeyboard}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <SafeAreaView>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ paddingBottom: 20 }}>
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: "bold",
                  marginTop: 20,
                  marginLeft: 20,
                }}
              >
                Tham gia cộng đồng CTU Social
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "300",
                  marginTop: 5,
                  marginLeft: 30,
                  color: "gray",
                }}
              >
                Phát triển bản thân và kết bạn với những người cùng đam mê
              </Text>
            </View>
            <View style={{ padding: 10, margin: 10, gap: 10 }}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>Email</Text>
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
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            <View style={{ padding: 10, margin: 10, gap: 10 }}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Tên thật của bạn
              </Text>
              <TextInput
                placeholder="nhập tên thật của bạn"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  height: 50,
                  width: "90%",
                  padding: 10,
                  borderRadius: 10,
                }}
                value={full_name}
                onChangeText={(text) => setFull_name(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Giới tính</Text>
              <ModalSelector
                data={genderOptions}
                initValue={gender === "nam" ? "Nam" : "Nữ"}
                onChange={(option) => setGender(option.key)}
                style={styles.selector}
                initValueTextStyle={styles.initValueText}
                selectTextStyle={styles.initValueText}
              />
            </View>
            <View style={{ padding: 10, margin: 10, gap: 10 }}>
              <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                Tuổi của bạn
              </Text>
              <TextInput
                placeholder="nhập tuổi của bạn"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  height: 50,
                  width: "90%",
                  padding: 10,
                  borderRadius: 10,
                }}
                value={age}
                onChangeText={(text) => setAge(text)}
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
                onPress={handleRegister}
              >
                <Text
                  style={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}
                >
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingTop: Platform.OS === "android" ? 45 : 0,
  },

  inputContainer: {
    padding: 10,
    margin: 10,
    gap: 10,
    width: "90%",
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  selector: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  initValueText: {
    fontSize: 16,
    color: "#333",
  },
});
