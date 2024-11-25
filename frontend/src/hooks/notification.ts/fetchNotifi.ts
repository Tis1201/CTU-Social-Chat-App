import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
import { getToken } from "../../app/utils/secureStore";

const fetchNotifications = async (userId: string) => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/notifications/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  return response.data;
};
export const useFetchNotifi = (userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(userId),
  });
  return { data, isLoading, error };
};
