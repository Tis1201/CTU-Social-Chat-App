
import axios from 'axios';
import { localhost } from '../app/constants/localhost';
import { getToken } from '../app/utils/secureStore';

// Hàm fetch cho từng postId
export const fetchCheckUserLike = async (postId: string) => {
  if (!postId) {
    console.error('Post ID is undefined');
    return;
  }
  const token = await getToken();
  try {
    const response = await axios.get(`${localhost}/posts/${postId}/like/user`, {
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

