import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
import { getToken } from "../../app/utils/secureStore"; // Giả sử bạn có một hàm lấy token

interface CommentData {
  userId: string;
  comment: string;
  postId: string;
}

const useCreateComment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userId, comment, postId }: CommentData) => {
      try {
        const token = await getToken(); // Lấy token từ một hàm nào đó

        console.log("Sending API request with data:", {
          userId,
          comment,
          postId,
        });

        const response = await axios.post(
          `${localhost}/posts/${postId}/comment`, // Thay URL bằng endpoint của bạn
          { userId, comment },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
              "Content-Type": "application/json",
              "Accept-Encoding": "gzip, deflate, br",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error sending API request:", error); 
        throw error; 
      }
    },
    onSuccess: (_, { postId }) => {
      console.log(`Comment added successfully for post ${postId}`);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      console.error("Error creating comment:", error); 
      alert("Failed to create comment. Please try again."); 
    },
  });

  return mutation;
};

export default useCreateComment;
