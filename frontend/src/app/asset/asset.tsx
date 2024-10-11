import { StyleSheet, Text, View, SafeAreaView, Platform, Dimensions, Pressable } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { router } from 'expo-router';

const asset = () => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container}>
        <Pressable 
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? 50 : 70,
            right: 20,
            zIndex: 1,
            padding: 10  // Add some padding to increase touch area
          }}
        >
          <Image 
              source={require('../../../assets/img/close.png')}
              style={{width: 18, height: 18}}
              contentFit='contain'
              cachePolicy="memory-disk" 
          />
        </Pressable>
        <View style={{width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
            <Image 
            source={require('../../../assets/img/feed1.jpg')}
            style={{width: screenWidth, height: '70%'}}
            contentFit='cover'
            cachePolicy="memory-disk" 
        />
        </View>
    </SafeAreaView>
  )
}

export default asset

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        paddingTop: Platform.OS === 'android' ? 45 : 0,
        flex: 1
    },
})