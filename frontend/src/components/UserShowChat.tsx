import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { localhost } from "../app/constants/localhost";
import React from "react";
import { Link } from "expo-router";
interface User {
  name: string;
  gender: string;
  emotion: string;
  avt: string;
  uid: string;
}

const UserShowChat = ({ name, gender, emotion, avt, uid }: User) => {
  const avatarBaseUrl = localhost;
  const avatarUrl = `${avatarBaseUrl}/${avt}`.replace(/\\/g, "/");

  return (
    <Link href={`/asset/ProfileUID?uid=${uid}`} asChild>
      <Pressable>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            paddingBottom: 15,
            paddingLeft: 10,
          }}
        >
          <Image
            source={{ uri: avatarUrl }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 100,
              position: "relative",
            }}
            cachePolicy="memory-disk"
          />
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: "rgba(189,188,247,1)",
              borderRadius: 100,
              position: "absolute",
              left: 55,
              top: 40,
            }}
          ></View>
          <View
            style={{
              gap: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  width: 20,
                  height: 20,
                  backgroundColor:
                    gender === "nam"
                      ? "rgba(105, 250, 250, 0.17)"
                      : "rgba(253, 156, 156, 0.17)",
                  borderRadius: 15,
                  justifyContent: "center",
                }}
              >
                {gender == "nam" ? (
                  <Image
                    source={require("../../assets/img/male.png")}
                    style={{
                      width: 15,
                      height: 15,
                    }}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                ) : (
                  <Image
                    source={require("../../assets/img/female.png")}
                    style={{
                      width: 15,
                      height: 15,
                    }}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                )}
              </View>
            </View>
            <Text
              style={{
                color: "gray",
                fontSize: 13,
              }}
            >
              {emotion}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default UserShowChat;

const styles = StyleSheet.create({});
