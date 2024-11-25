import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { localhost } from '../../app/constants/localhost';
import { getToken } from '../../app/utils/secureStore';

// Hàm fetch cho từng postId
export const fetchCountComment = async (postId: string) => {
  if (!postId) {
    console.error('Post ID is undefined');
    return;
  }
  const token = await getToken();
  try {
    const response = await axios.get(`${localhost}/posts/${postId}/comment/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to check like post: ${error}`);
    throw error; // Ném lại lỗi để có thể xử lý trong component
  }
};

export const useCommentCount = (postId: string) => {
  return useQuery({
    queryKey: ['commentCount', postId], // Thêm postId vào queryKey để đảm bảo rằng mỗi postId có một cache riêng
    queryFn: () => fetchCountComment(postId), // Truyền một hàm mà gọi fetchCountComment
    enabled: !!postId, // Chỉ kích hoạt truy vấn nếu có postId
  });
};
