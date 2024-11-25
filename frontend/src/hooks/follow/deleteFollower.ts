import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../../app/utils/secureStore";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";

const deleteFollow = async (uid: string) => {
  const token = await getToken();
  const response = await axios.delete(`${localhost}/users/${uid}/follow`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useDeleteFollow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uid: string) => deleteFollow(uid),
    onSuccess: (_, uid) => {
      // Cập nhật danh sách following trong cache
      queryClient.setQueryData(["following"], (oldData: any[]) =>
        oldData.filter((user) => user._id !== uid)
      );
    },
  });
};
