import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
import { getToken } from "../../app/utils/secureStore";

const fetchFollowingPosts = async (page: number) => {
  const limit = 5;
  const token = await getToken();
  const response = await axios.get(
    `${localhost}/users/following-posts?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
      },
    }
  );
  return response.data;
};

export const useFollowingPosts = (page: number) => {
  return useQuery({
    queryKey: ["following-posts", page],
    queryFn: () => fetchFollowingPosts(page),
    placeholderData: keepPreviousData, // Giữ lại dữ liệu từ trang trước
  });
};
