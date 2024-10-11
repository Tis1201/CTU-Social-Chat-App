import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import Post from './Post'; 

const FollowFeed = () => {
  const { width: windowWidth } = useWindowDimensions();
  const [data, setData] = useState([1, 2, 3, 4, 5, 6]);
  const [visibleItems, setVisibleItems] = useState(2); // Số lượng item hiển thị ban đầu

  // Hàm gọi khi cuộn đến gần cuối danh sách
  const handleEndReached = () => {
    setVisibleItems(prev => Math.min(prev + 2, data.length)); // Tăng số lượng item hiển thị lên 2
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlashList
        data={data.slice(0, visibleItems)} // Chỉ hiển thị số lượng item hiện tại
        renderItem={({ item }) => <Post />} // Thay thế bằng component Post của bạn
        keyExtractor={(item) => item.toString()} // Tạo key cho mỗi item
        showsVerticalScrollIndicator={false}
        estimatedItemSize={200}
        onEndReached={handleEndReached} // Gọi khi cuộn đến gần cuối
        onEndReachedThreshold={0.3} // Gọi khi người dùng cuộn đến 50% của chiều cao danh sách
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FollowFeed;
