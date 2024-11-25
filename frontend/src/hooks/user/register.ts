import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";

const registerUser = async (payload: any) => {
  try {
    const response = await axios.post(`${localhost}/users/register`, payload);
    return response.data;
  } catch (error: any) {
    // Log lỗi ra console để tiện chẩn đoán
    console.error("Error during user registration:", error);

    // Nếu có phản hồi từ server (lỗi 4xx/5xx)
    if (error.response) {
      console.error("Server Response:", error.response.data);

      // Ném lỗi với thông báo từ server nếu có
      throw new Error(
        error.response.data.message ||
          "Registration failed due to server error."
      );
    }

    // Nếu không có phản hồi từ server (lỗi mạng)
    throw new Error(
      error.message || "Network error occurred during registration."
    );
  }
};

const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export default useRegister;
