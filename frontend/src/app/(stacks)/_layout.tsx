import React from 'react';
import { Stack } from 'expo-router';



const StackLayout = () => {

  return (
    <Stack>
      <Stack.Screen
        name="UserChatOut"
        options={{ title: 'Chat Out' }}
      />
      <Stack.Screen
        name="UserChatIn"
        options={{ 
          title: 'Chat In', 
          headerShown:false
        
        }}
      />
      <Stack.Screen
        name="NotifyScreen"
        options={{ 
          title: 'NotifyScreen', 
          headerShown:false
        
        }}
      />
    </Stack>
  );
}

export default StackLayout;