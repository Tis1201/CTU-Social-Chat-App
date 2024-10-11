import { StyleSheet, Text, View, Image,SafeAreaView, Platform } from 'react-native'
import React from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
import UserChatOut from '../(stacks)/UserChatOut'

const Chat = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Text chats header */}
      <View>
        <Text style={styles.headerText}>Đoạn chat</Text>
      </View>

       {/* Search user chat header */}
      <View style={{
        width:'100%',
        padding:15,

      }}>
        <View style={{
            backgroundColor:'rgba(219, 219, 219, 0.8)',
            borderRadius:25,
            flexDirection:'row',
            height:40,
            alignItems:'center',
            gap:10,
            paddingLeft:15
        }}>
          <Image 
            source={require('../../../assets/img/search-chat.png')}
            style={{
              width:23,
              height:23,
              resizeMode:'contain',
              
            }}
          />
          <Text style={{
            color:'gray',
            fontSize:17
          }}>Tìm kiếm</Text>
        </View>

      </View>

      {/* List user chat */}
        <UserChatOut />
    </SafeAreaView>
  )
}

export default Chat

const styles = StyleSheet.create({
  container:{
    backgroundColor:'white',
    flex:1,
    paddingTop: Platform.OS === 'android' ? 45 : 0
  },
  headerText:{
    fontWeight:'bold',
    fontSize:25,
    textAlign:'center'
  }
})