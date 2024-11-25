import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
import { getToken } from "../../app/utils/secureStore";

const fetchCommentByPost = async (postId: string) => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/posts/${postId}/comment`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  return response.data;
};

export const usePostId = (postId: string) => {
  return useQuery({
    queryKey: ["userPostId", postId], // thêm postId vào queryKey để có cache riêng cho từng post
    queryFn: () => fetchCommentByPost(postId), // truyền hàm như một tham chiếu
  });
};
