import { StyleSheet, Image } from 'react-native';
import React from 'react';
import { Link, Tabs,router } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../../../redux/store'; // Đảm bảo đường dẫn chính xác
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const _layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Tabs 
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: 'black',
              tabBarShowLabel: false,
              tabBarStyle: {
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                headerTitle: 'Home',
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={focused ? require('../../../assets/img/homepage.png') : require('../../../assets/img/homepage-nofill.png')}
                    style={{ width: 26, height: 26 }}
                    resizeMode="contain"
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="new"
              options={{
                headerTitle: 'New Feed',
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={focused ? require('../../../assets/img/global-fill.png') : require('../../../assets/img/global.png')}
                    style={{ width: 26, height: 26 }}
                    resizeMode="contain"
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="chat"
              options={{
                headerTitle: 'Chat',
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={focused ? require('../../../assets/img/message-fill.png') : require('../../../assets/img/message.png')}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                headerTitle: 'Profile',
                tabBarIcon: ({ focused }) => (
                  <Image
                    source={focused ? require('../../../assets/img/user-fill.png') : require('../../../assets/img/user-nofill.png')}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                ),
              }}
            />
        </Tabs>

      </Provider>

    </QueryClientProvider>
  )
}

export default _layout
const styles = StyleSheet.create({})