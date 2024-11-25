import { useQuery } from "@tanstack/react-query";
import { localhost } from "../app/constants/localhost";
import { getToken } from "../app/utils/secureStore";
import axios from "axios";

// Cập nhật hàm postConversation để nhận thêm idUser và idParticipants
const postConversation = async (idUser: any, idParticipants: any) => {
  const token = await getToken();
  
  // Gửi idUser và idParticipants trong payload
  const response = await axios.post(`${localhost}/conversations/`, { 
    participants: [idUser, ...idParticipants], // Gửi danh sách người tham gia
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  
  return response.data;
};

// Sử dụng useQuery và thêm các tham số vào hàm
export const usePostConversation = (idUser: any, idParticipants: string | any[]) => {
  return useQuery({
    queryKey: ['postConversation', idUser, idParticipants], // Thêm các tham số vào queryKey
    queryFn: () => postConversation(idUser, idParticipants), // Truyền tham số vào hàm
    enabled: !!idUser && idParticipants.length > 0 // Chỉ thực hiện query nếu có idUser và idParticipants
  });
};
