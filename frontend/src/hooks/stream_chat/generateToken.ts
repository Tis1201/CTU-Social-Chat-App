
import axios from 'axios';
import { localhost } from '../../app/constants/localhost';
import { getToken, getUserIdFromToken } from '../../app/utils/secureStore';
import { useQuery } from '@tanstack/react-query';
// Hàm fetch cho từng postId
export const generateToken = async () => {
  const token = await getToken();
  if (!token) {
    console.error('Token is undefined');
    return;
  }
  const userId = await getUserIdFromToken();
  try {
    const response = await axios.get(`${localhost}/messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to check like post: ${error}`);
  }
};

export const useGenerateToken = () => {
  return useQuery({
    queryKey: ['generateToken'],
    queryFn: generateToken,
  });
};

