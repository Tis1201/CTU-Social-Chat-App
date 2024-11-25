import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
const getUname = async (uid: string) => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/users/${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useUname = (uid: string) => {
  return useQuery({
    queryKey: ["uname", uid],
    queryFn: () => getUname(uid),
  });
};
