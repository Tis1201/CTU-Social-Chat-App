import { StyleSheet, Text, View, Platform, useWindowDimensions, Pressable } from 'react-native';
import React, { useEffect, useCallback } from 'react';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { localhost } from '../app/constants/localhost';
import useSocket from '../socket/socket';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toggleLike, fetchLikeCount, fetchUserLikeStatus } from '../../redux/likeSlice';
import { fetchLikePosts} from '../hooks/fetchLikePost'; // Import the hook

interface PostProps {
  post: any;
}

const PostUserId: React.FC<PostProps> = ({ post }) => {
  const windowWidth = useWindowDimensions().width;
  const avatarBaseUrl = localhost;
  const socket = useSocket();
  const dispatch = useDispatch();
  
  const likesState = useSelector((state: RootState) => state.like.likesState) as { [key: string]: any };
  const isLiked = likesState[post._id as string];
  const countLike = useSelector((state: RootState) => state.like.countLike) as { [key: string]: any };
  const count = countLike[post._id as string];

  const avatarUrl = post.avatar_url.startsWith('http') 
    ? post.avatar_url 
    : `${avatarBaseUrl}/${post.avatar_url.replace(/\\/g, '/')}`;

  const mediaUrl = post.media && post.media.length > 0 
    ? `${avatarBaseUrl}${post.media[0].url}` 
    : null; 

  const handleLikePost = useCallback(async () => {
    dispatch(toggleLike(post._id)); // Thay đổi trạng thái like
    socket.socket?.emit('postUpdated', post._id);
    // Gọi lại fetchLikeCount để cập nhật số lượng like
    await fetchLikePosts(post._id);
    dispatch(fetchLikeCount(post._id) as any);
  }, [dispatch, post._id, socket]);

  useEffect(() => {
    dispatch(fetchUserLikeStatus(post._id) as any);
    dispatch(fetchLikeCount(post._id) as any);
  }, [dispatch, post._id]);

  useEffect(() => {
    const handlePostUpdate = (updatedPostId: string) => {
      if (updatedPostId === post._id) {
          dispatch(fetchUserLikeStatus(updatedPostId) as any); // Gọi fetchUserLikeStatus để kiểm tra trạng thái like
          dispatch(fetchLikeCount(updatedPostId) as any); // Gọi fetchLikeCount để lấy số lượng like
      }
    };

    socket.socket?.on('postUpdated', handlePostUpdate);

    return () => {
      socket.socket?.off('postUpdated', handlePostUpdate);
    };
  }, [dispatch, post._id, socket]);

  return (
    <View style={{ marginTop: 10, paddingBottom: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 10 }}>
        <Image 
          source={avatarUrl}
          style={{ width: 50, height: 50, borderRadius: 100 }}
          contentFit='cover'
          cachePolicy="memory-disk" 
        />
        <View style={{ marginRight: Platform.OS === 'ios' ? 25 : 35 }}>
          <Text style={{ fontWeight: 'light', fontSize: 17 }}>{post.name}</Text>
          <Text style={{ color: 'gray', fontSize: 11 }}>Hoạt động 4 giờ trước </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <View style={{ width: 80, height: 25, backgroundColor: 'rgba(150,149,151,0.08)', justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}>
            <Text style={{ color: 'rgba(193,1,241,0.3)', fontWeight: 'bold', fontSize: 12 }}>Trò chuyện</Text>
          </View>
          <Image 
            source={require('../../assets/img/more.png')}
            style={{ width: 20, height: 20 }}
            contentFit='contain'
            cachePolicy="memory-disk" 
          />
        </View>
      </View>
      <View>
        <Text style={{ paddingLeft: 15, paddingTop: 15 }}>{post.content}</Text>
        <Link href='/asset/asset' asChild>
          {post.media.length > 0 && (
            <Pressable>
              <Image 
                source={mediaUrl}
                style={{ width: '100%', height: 250, aspectRatio: 3 / 4, borderRadius: 15, marginLeft: 10, marginTop: 10 }}
                contentFit='cover'
                cachePolicy="memory-disk" 
              />
            </Pressable>
          )}
        </Link>
      </View>    
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Pressable onPress={handleLikePost}>
            <Image 
              source={isLiked ? require('../../assets/img/heart-red.png') : require('../../assets/img/heart-nofill.png')}
              style={{ width: 25, height: 25 }}
              contentFit='contain'
              cachePolicy="memory-disk" 
            />
          </Pressable>
          <Text>{count}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image 
            source={require('../../assets/img/comment.png')}
            style={{ width: 25, height: 25 }}
            contentFit='contain'
            cachePolicy="memory-disk" 
          />
          <Text>300</Text>
        </View>
      </View>
    </View>
  );
};

export default PostUserId;

const styles = StyleSheet.create({});
