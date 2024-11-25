import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "../../redux/store";


// Cấu hình behavior thông báo
const configureNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

// Hàm yêu cầu quyền thông báo
const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("Notification permission not granted");
  } else {
    console.log("Notification permission granted");
  }
};

// Tạo một component Layout để sử dụng hook
const Layout = () => {
  useEffect(() => {
    configureNotificationHandler(); // Set up the notification handler once
    requestNotificationPermission(); // Gọi yêu cầu quyền khi ứng dụng khởi động
  }, []);

  // Tạo một instance của QueryClient
  const queryClient = new QueryClient();



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
          <Stack screenOptions={{ headerShown: false }} />
          </Provider>
        </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

// Export component Layout
export default Layout;

const styles = StyleSheet.create({});
