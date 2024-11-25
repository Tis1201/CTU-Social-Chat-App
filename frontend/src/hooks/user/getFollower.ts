import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
const getFollower = async () => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/users/followers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useFollower = () => {
  return useQuery({
    queryKey: ["follower"],
    queryFn: () => getFollower(),
  });
};
