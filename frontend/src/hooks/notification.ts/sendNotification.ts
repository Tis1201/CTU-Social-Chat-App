import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
import { getToken } from "../../app/utils/secureStore";

const sendNotification = async (data: any) => {
  const token = await getToken();
  const response = await axios.post(`${localhost}/notifications`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  
  return response.data;
};

export const useSendNotification = () => {
  return useMutation({
    mutationFn: sendNotification,
  });
};
