import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
const getFollow = async (uid: string) => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/users/${uid}/count`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useFollow = (uid: string) => {
  return useQuery({
    queryKey: ["follow", uid],
    queryFn: () => getFollow(uid),
  });
};
