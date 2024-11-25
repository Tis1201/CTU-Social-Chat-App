import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { localhost } from '../../app/constants/localhost';
import { getToken } from '../../app/utils/secureStore';
import socket from '../../socket/socket'; // Đường dẫn đến file socket

export const fetchLikePosts = async (postId: string) => {
  if (!postId) {
    console.error('Post ID is undefined');
    return;
  }

  const token = await getToken();
  try {
    const response = await axios.post(`${localhost}/posts/${postId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to like post: ${error}`);
    throw error;
  }
};

export const useLikePosts = (postId: string) => {
  const queryOptions: UseQueryOptions<any, Error> = {
    queryKey: ['postUpdated', postId],
    queryFn: () => fetchLikePosts(postId),
    enabled: !!postId,
  };

  const query = useQuery(queryOptions);

  const onSuccess = () => {
    socket().emit('postUpdated', postId);
  };

  query.refetch().then(onSuccess);

  return query;
};
