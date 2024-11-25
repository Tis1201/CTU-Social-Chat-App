import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
import { getToken, getUserIdFromToken } from "../../app/utils/secureStore";

// Hàm cập nhật trạng thái ẩn bài viết
const updateHide = async (postId: string): Promise<any> => {
  const uid = await getUserIdFromToken();
  const token = await getToken();

  // Thực hiện yêu cầu PATCH với headers
  const response = await axios.patch(
    `${localhost}/posts/${postId}/${uid}`,
    {}, // Không cần body data
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Sử dụng JSON
      },
    }
  );

  return response.data;
};

// Hook sử dụng updateHide
const useUpdateHide = (): UseMutationResult<any, Error, string> => {
  return useMutation<any, Error, string>({
    mutationFn: (postId: string) => updateHide(postId),
  });
};

export default useUpdateHide;
