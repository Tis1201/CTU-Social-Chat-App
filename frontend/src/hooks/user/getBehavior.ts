import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
const getBehavior = async (uid: string) => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/users/behavior/${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const useBehavior = (uid: string) => {
  return useQuery({
    queryKey: ["behavior", uid],
    queryFn: () => getBehavior(uid),
  });
};
