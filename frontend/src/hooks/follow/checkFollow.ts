import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
const checkFollow = async (uid: string) => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/users/${uid}/check-followed`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      
    },
  });
  return response.data;
};

export const useCheckFollow = (uid: string) => {
  return useQuery({
    queryKey: ["checkFollow", uid],
    queryFn: () => checkFollow(uid),
  });
};
