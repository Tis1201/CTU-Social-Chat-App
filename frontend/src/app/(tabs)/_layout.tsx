import { StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs, router } from "expo-router";
import { Provider } from "react-redux";
import store from "../../../redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const TabIcons = {
  home: {
    active: require("../../../assets/img/homepage.png"),
    inactive: require("../../../assets/img/homepage-nofill.png"),
  },
  feed: {
    active: require("../../../assets/img/global-fill.png"),
    inactive: require("../../../assets/img/global.png"),
  },
  chat: {
    active: require("../../../assets/img/message-fill.png"),
    inactive: require("../../../assets/img/message.png"),
  },
  profile: {
    active: require("../../../assets/img/user-fill.png"),
    inactive: require("../../../assets/img/user-nofill.png"),
  },
};

const _layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "black",
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBarStyle,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              headerTitle: "Home",
              tabBarIcon: ({ focused }) => (
                <Image
                  source={
                    focused ? TabIcons.home.active : TabIcons.home.inactive
                  }
                  style={styles.icon}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="new"
            options={{
              headerTitle: "New Feed",
              tabBarIcon: ({ focused }) => (
                <Image
                  source={
                    focused ? TabIcons.feed.active : TabIcons.feed.inactive
                  }
                  style={styles.icon}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              headerTitle: "Chat",
              tabBarIcon: ({ focused }) => (
                <Image
                  source={
                    focused ? TabIcons.chat.active : TabIcons.chat.inactive
                  }
                  style={styles.icon}
                  resizeMode="contain"
                />
              ),
              tabBarButton: (props: any) => (
                <TouchableOpacity
                  {...props}
                  onPress={() => router.push("/(stacks)")}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              headerTitle: "Profile",
              tabBarIcon: ({ focused }) => (
                <Image
                  source={
                    focused
                      ? TabIcons.profile.active
                      : TabIcons.profile.inactive
                  }
                  style={styles.icon}
                  resizeMode="contain"
                />
              ),
            }}
          />
        </Tabs>
      </Provider>
    </QueryClientProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 26,
    height: 26,
  },
});
