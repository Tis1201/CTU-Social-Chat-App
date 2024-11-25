import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { localhost } from "../../app/constants/localhost";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { AxiosError } from "axios";

// Định nghĩa kiểu cho postData
interface Media {
  url: string;
}

interface Location {
  type: string; // "Point"
  coordinates: number[]; // [longitude, latitude]
}

// Cập nhật kiểu cho postData
interface PostData {
  content: string;
  media: Media[];
  location: Location;
}

const useCreatePost = (): UseMutationResult<any, Error, FormData> => {
  // Thay đổi ở đây
  const mutation = useMutation<any, Error, FormData>({
    mutationFn: async (formData) => {
      // Thay đổi ở đây
      try {
        const token = await getToken();

        const response = await axios.post(`${localhost}/posts/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "Accept-Encoding": "gzip, deflate, br",
          },
        });

        return response.data;
      } catch (error: unknown) {
        // Kiểm tra nếu error là AxiosError
        if (axios.isAxiosError(error)) {
          console.error("Error while creating post:", error.response?.data);
          throw new Error(
            error.response?.data.message || "Error creating post"
          );
        } else {
          console.error("Unexpected error:", error);
          throw new Error("An unexpected error occurred");
        }
      }
    },
  });

  return mutation;
};

export default useCreatePost;
