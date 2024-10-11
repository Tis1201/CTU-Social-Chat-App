import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { localhost } from '../app/constants/localhost';
import { getToken } from '../app/utils/secureStore';

const fetchUserPosts = async () => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/posts/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  return response.data;
};
export const useUserPosts = () => {
  return useQuery({ queryKey: ['userPosts'], queryFn: fetchUserPosts });
};