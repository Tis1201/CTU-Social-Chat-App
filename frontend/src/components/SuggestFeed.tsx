import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import Post from "./Post";
import { usePosts } from "../hooks/post/fetchPost";

interface Post {
  _id: string;
  content: string;
  media?: { type: string; url: string; _id: string }[];
  user_id: string;
  created_at: string;
  name: string;
  avatar_url: string;
  is_online: boolean;
  last_online: string;
}

const SuggestFeed = () => {
  const [state, setState] = useState({
    currentPage: 1,
    allPosts: new Map<string, Post>(),
    hasMore: true,
    isLoadingMore: false,
  });

  const {
    data: newPosts,
    isLoading,
    error,
    refetch,
  } = usePosts(state.currentPage);

  const reloadPage = useCallback(async () => {
    setState({
      currentPage: 1,
      allPosts: new Map(),
      hasMore: true,
      isLoadingMore: false,
    });
    await refetch();
  }, [refetch]);

  useEffect(() => {
    if (newPosts?.posts) {
      setState((prev) => {
        const updatedPosts = new Map(prev.allPosts);
        newPosts.posts.forEach((post: Post) =>
          updatedPosts.set(post._id, post)
        );
        return {
          ...prev,
          allPosts: updatedPosts,
          hasMore: newPosts.posts.length >= 5,
        };
      });
    }
  }, [newPosts]);

  const handleEndReached = useCallback(() => {
    if (state.hasMore && !state.isLoadingMore) {
      setState((prev) => ({
        ...prev,
        isLoadingMore: true,
        currentPage: prev.currentPage + 1,
      }));
    }
  }, [state.hasMore, state.isLoadingMore]);

  useEffect(() => {
    if (state.currentPage > 1) {
      refetch().finally(() =>
        setState((prev) => ({ ...prev, isLoadingMore: false }))
      );
    }
  }, [state.currentPage, refetch]);

  const postArray = useMemo(
    () => Array.from(state.allPosts.values()),
    [state.allPosts]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlashList
        data={postArray}
        renderItem={({ item }) => (
          <Post
            post={item}
            onHidePost={(postId: string) =>
              setState((prev) => {
                const updatedPosts = new Map(prev.allPosts);
                updatedPosts.delete(postId);
                return { ...prev, allPosts: updatedPosts };
              })
            }
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={317}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isLoading}
        onRefresh={reloadPage}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SuggestFeed;
