import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { localhost } from '../app/constants/localhost';
import { getToken } from '../app/utils/secureStore';

const fetchPosts = async () => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/posts/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  return response.data;
};
export const usePosts = () => {
  return useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
};
