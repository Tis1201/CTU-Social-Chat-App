import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import Post from "./Post";
import { useFollowingPosts } from "../hooks/post/fecthFollowingPost";

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

const FollowFeed = () => {
  const [state, setState] = useState({
    currentPage: 1,
    allPosts: new Map<string, Post>(),
    hasMore: true,
    isLoadingMore: false,
  });

  const { data: newPostsFollowing, isLoading, error, refetch } = useFollowingPosts(state.currentPage);

  // Hàm tải lại toàn bộ bài viết
  const reloadPage = useCallback(async () => {
    setState({
      currentPage: 1,
      allPosts: new Map(),
      hasMore: true,
      isLoadingMore: false,
    });
    await refetch();
  }, [refetch]);

  // Cập nhật bài viết khi có dữ liệu mới
  useEffect(() => {
    if (newPostsFollowing?.posts) {
      setState((prevState) => {
        const updatedPosts = new Map(prevState.allPosts);
        newPostsFollowing.posts.forEach((post: Post) => updatedPosts.set(post._id, post));
        return {
          ...prevState,
          allPosts: updatedPosts,
          hasMore: newPostsFollowing.posts.length >= 5,
        };
      });
    }
  }, [newPostsFollowing]);

  // Tải thêm bài viết khi chạm đáy
  const handleEndReached = useCallback(() => {
    if (state.hasMore && !state.isLoadingMore) {
      setState((prevState) => ({
        ...prevState,
        isLoadingMore: true,
        currentPage: prevState.currentPage + 1,
      }));
    }
  }, [state.hasMore, state.isLoadingMore]);

  // Tải bài viết khi trang thay đổi
  useEffect(() => {
    if (state.currentPage > 1) {
      refetch().finally(() =>
        setState((prevState) => ({ ...prevState, isLoadingMore: false }))
      );
    }
  }, [state.currentPage, refetch]);

  const postArray = useMemo(() => Array.from(state.allPosts.values()), [state.allPosts]);

  if (isLoading && state.currentPage === 1) {
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

export default FollowFeed;
