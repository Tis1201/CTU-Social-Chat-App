import React from "react";
import { View, Text } from "react-native";
import UserShowChat from "./UserShowChat";
import HeaderConnect from "./HeaderConnect";
import { FlashList } from "@shopify/flash-list";
import { getToken } from "../app/utils/secureStore";
import { localhost } from "../app/constants/localhost";
import { useInfiniteQuery } from "@tanstack/react-query";

interface User {
  _id: string;
  full_name: string;
  gender: string;
  bio: string;
  avatar_url: string;
  behavior: number;
}

interface ListUserShowChatProps {
  genderFilter?: "nam" | "nữ" | "cả hai";
  selectedId: number | null;
}

const LIMIT = 10;

const ListUserShowChat: React.FC<ListUserShowChatProps> = ({
  genderFilter = "cả hai",
  selectedId,
}) => {
  const fetchUsers = async ({ pageParam = 1 }) => {
    const token = await getToken();
    if (!token) {
      throw new Error("No token available");
    }

    const url = `${localhost}/users/gender?gender=${genderFilter}&page=${pageParam}&limit=${LIMIT}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    return {
      users: data.users,
      nextPage: data.users.length === LIMIT ? pageParam + 1 : undefined,
    };
  };

  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["users", genderFilter],
      queryFn: fetchUsers,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    });

  const allUsers = data?.pages.flatMap((page) => page.users) || [];

  const filteredData =
    genderFilter === "cả hai"
      ? allUsers
      : allUsers.filter((user) => user.gender === genderFilter);

  const finalData =
    selectedId !== null
      ? filteredData.filter((user) => user.behavior === selectedId)
      : filteredData;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading data</Text>
      </View>
    );
  }

  return (
    <FlashList
      data={finalData}
      renderItem={({ item }) => (
        <UserShowChat
          name={item.full_name}
          gender={item.gender}
          emotion={item.bio}
          avt={item.avatar_url}
          uid={item._id}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 0,
      }}
      keyExtractor={(item, index) => `${item._id}-${index}`}
      ListHeaderComponent={<HeaderConnect />}
      estimatedItemSize={80}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.8}
    />
  );
};

export default ListUserShowChat;
