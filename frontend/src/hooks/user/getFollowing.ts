import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
const getFollowing = async () => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/users/following`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useFollowing = () => {
  return useQuery({
    queryKey: ["following"],
    queryFn: () => getFollowing(),
  });
};
