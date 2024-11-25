import { useMutation } from "@tanstack/react-query";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";

const addFollow = async (uid: string) => {
  const token = await getToken();
  const response = await axios.post(
    `${localhost}/users/${uid}/follow`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useAddFollow = () => {
  return useMutation({
    mutationFn: (uid: string) => addFollow(uid),
  });
};
