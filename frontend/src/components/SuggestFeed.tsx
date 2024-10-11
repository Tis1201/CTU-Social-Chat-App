import React, { useState, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions,Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import Post from './Post'; 
import { usePosts } from '../hooks/fetchPost'; // Import hook to fetch posts

const SuggestFeed = () => {
  const { width: windowWidth } = useWindowDimensions();
  const [visibleItems, setVisibleItems] = useState(2); // Số lượng item hiển thị ban đầu
  const { data: posts, isLoading, error, refetch } = usePosts(); // Use hook to fetch posts

  // Hàm gọi khi cuộn đến gần cuối danh sách
  const handleEndReached = () => {
    setVisibleItems(prev => Math.min(prev + 2, posts.posts.length)); // Tăng số lượng item hiển thị lên 2
  };

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlashList
        data={posts?.posts || []} 
        renderItem={({ item }: { item: any }) => <Post post={item} />} 
        keyExtractor={(item: any) => item._id ? item._id.toString() : Math.random().toString()} 
        showsVerticalScrollIndicator={false}
        estimatedItemSize={200}
        onEndReached={handleEndReached} 
        onEndReachedThreshold={0.3} 
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SuggestFeed;
