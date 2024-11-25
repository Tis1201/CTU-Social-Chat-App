import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Pressable, View, Text } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from '@react-navigation/native';
const queryClient = new QueryClient();

const StackLayout = () => {

  const navigation = useNavigation();
  const handlePress = () => {
    navigation.goBack();
  };
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <Provider store={store}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{ title: "Chat Out", headerShown: false }}
            />
            <Stack.Screen
              name="UserChatIn"
              options={{
                title: "Chat In",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NotifyScreen"
              options={{
                title: "NotifyScreen",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PostScreen"
              options={{
                title: "Tạo bài viết",
                headerTitleAlign: "center",
                headerLeft: () => (
                  <Pressable onPress={handlePress} >
                    <Image
                      source={require("../../../assets/img/left-arrow.png")}
                      style={{ width: 20, height: 20 }}
                      contentFit="contain"
                      cachePolicy="memory-disk"
                    />
                  </Pressable>
                ),
              }}
            />
          </Stack>
        </Provider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default StackLayout;
