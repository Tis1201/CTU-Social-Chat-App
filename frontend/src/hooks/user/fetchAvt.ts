import { useQuery } from "@tanstack/react-query";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
const getAvt = async (uid: string) => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/users/avt/${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useAvt = (uid: string) => {
  return useQuery({
    queryKey: ["avt", uid],
    queryFn: () => getAvt(uid),
  });
};
