import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { localhost } from '../../app/constants/localhost';
import { getToken } from '../../app/utils/secureStore';

const fetchUserPostsId = async (uid: string) => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/posts/user/${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  return response.data;
};
export const useUserPostsId = (uid: string) => {
    return useQuery({ queryKey: ['userPostsId', uid], queryFn: () => fetchUserPostsId(uid) });
};
