import { useQuery } from "@tanstack/react-query";
import { localhost } from "../app/constants/localhost";
import { getToken } from "../app/utils/secureStore";

import axios from "axios";

const refreshToken = async () => {
  const token = await getToken();
  const response = await axios.post(`${localhost}/auth/refresh-token`, { 
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
   });
  return response.data;
};

export const useRefreshToken = () => {
    return useQuery({ queryKey: ['refreshToken'], queryFn: refreshToken });
};
