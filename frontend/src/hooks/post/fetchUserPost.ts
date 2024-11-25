import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { localhost } from '../../app/constants/localhost';
import { getToken, getUserIdFromToken } from '../../app/utils/secureStore';

const fetchUserPosts = async () => {
  const token = await getToken();
  const uid = await getUserIdFromToken();
  const response = await axios.get(`${localhost}/posts/user/${uid}`, {
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
