import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import store from '../../../redux/store';


const AuthLayout = () => {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>

    </Provider>
  );
}

export default AuthLayout;