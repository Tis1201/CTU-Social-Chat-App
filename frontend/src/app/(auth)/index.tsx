import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import {  deleteToken, getBehaviorFromToken, getToken } from '../utils/secureStore'
import { useDispatch } from 'react-redux'
import { setSelectedId } from '../../../redux/userSlice'
import store from '../../../redux/store'
import { localhost } from '../constants/localhost'

const Welcome = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken()
      
      if (token) {
        const response = await fetch(`${localhost}/users/check-refresh-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br'
          },
        });
        const data = await response.json();
        if (data) {
          setIsLoggedIn(true)
          const behavior =  await getBehaviorFromToken();
          dispatch(setSelectedId(behavior)); 
          router.replace('/(tabs)')
        } else {
          console.log('Session has expired');
          setIsLoggedIn(false);
          deleteToken();
        }
      }
    }
    checkToken()
  }, [isLoggedIn])

  const handleStart = () => {
    router.push('/login')
  }

  return (
      <View style={styles.container}>
        <Image 
          source={require('../../../assets/img/logo-home-blue.jpg')} 
          style={{ width: '70%', height: '80%', position: 'relative' }}
          contentFit='contain'
        />
        <Text style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? 355 : 385,
          fontSize: Platform.OS === 'ios' ? 11 : 13,
          fontWeight: 'light',
          color: 'gray'
        }}>Chào mừng bạn đến với mạng xã hội CTU</Text>
        {!isLoggedIn && (
          <TouchableOpacity style={{
            position: 'absolute',
            top: 440,
            height: 60,
            width: 200,
            backgroundColor: '#2980b8',
            padding: 10,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }} onPress={handleStart}>
            <Text style={{
              color: '#fff',
              fontSize: 17,
              fontWeight: 'light',
            }}>Bắt đầu ngay</Text>
          </TouchableOpacity>
        )}
      </View>

  )
}

export default Welcome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
})