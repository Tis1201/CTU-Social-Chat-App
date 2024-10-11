import { StyleSheet, Text, View, Image,Dimensions, useWindowDimensions } from 'react-native'
import React from 'react'

const HobbyTag = () => {
  const widthSreen = useWindowDimensions().width;
  return (
    <View style={{
      width:'100%',
      flexDirection:'row',
      alignItems:'center',
      gap:5,
      paddingHorizontal:10,
      paddingTop:20,
      paddingBottom:20
    }}>
      <View style={{
        width:widthSreen/2,
        height:100,
        backgroundColor:'rgba(255,127,193,0.17)',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:15,
        flexShrink:1
      }}>
          <Image 
            source={require('../../assets/img/chat-pink.png')}
            style={{
              width:40,
              height:40
            }}
            resizeMode='contain'
          />
          <Text style={{
            fontWeight:'bold',
            fontSize:15,
            paddingTop:8
          }}>Nhắn tin</Text>
          <View style={{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            paddingLeft:15

          }}>
            <Text style={{
              color:'gray',
              fontSize:10,
              
            }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >2500 trực tuyến</Text>
            <Image 
              source={require('../../assets/img/dot.png')}
              style={{
                width:20,
                height:20
              }}
              resizeMode='contain'
            />
          </View>

      </View>
      <View style={{
        width:widthSreen/2,
        height:100,
        backgroundColor:'rgba(143,255,151,0.17)',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:15,
        flexShrink:1
      }}>
          <Image 
            source={require('../../assets/img/phone.png')}
            style={{
              width:40,
              height:40
            }}
            resizeMode='contain'
          />
          <Text style={{
            fontWeight:'bold',
            fontSize:15,
            paddingTop:8
          }}>Gọi điện</Text>
          <View style={{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            paddingLeft:15

          }}>
            <Text style={{
              color:'gray',
              fontSize:10,
              
            }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >2500 trực tuyến</Text>
            <Image 
              source={require('../../assets/img/dot.png')}
              style={{
                width:20,
                height:20
              }}
              resizeMode='contain'
            />
          </View>

      </View>
  

    </View>
  )
}

export default HobbyTag
