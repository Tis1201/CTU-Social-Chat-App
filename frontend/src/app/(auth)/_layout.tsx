import React from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const AuthLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="SetAvt" options={{ headerShown: false }} />
        </Stack>
      </Provider>
    </QueryClientProvider>
  );
};

export default AuthLayout;
