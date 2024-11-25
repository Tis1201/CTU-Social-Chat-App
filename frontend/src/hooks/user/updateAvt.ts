import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
import { getToken, getUserIdFromToken } from "../../app/utils/secureStore";

// Hàm cập nhật avatar
const updateAvatar = async (formData: FormData): Promise<any> => {
  const uid = await getUserIdFromToken();
  const token = await getToken();

  const response = await axios.patch(
    `${localhost}/users/avt/${uid}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Hook cập nhật avatar
const useUpdateAvatar = (): UseMutationResult<any, Error, FormData> => {
  return useMutation<any, Error, FormData>({
    mutationFn: (formData: FormData) => updateAvatar(formData),
  });
};

export default useUpdateAvatar;
