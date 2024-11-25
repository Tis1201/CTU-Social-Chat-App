import { useState, useEffect } from "react";
import axios from "axios";
import { localhost } from "../../app/constants/localhost";
import { getToken } from "../../app/utils/secureStore";

const fetchPostById = async (postId: string) => {
  const token = await getToken();
  const response = await axios.get(`${localhost}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  return response.data;
};

export const usePostId = (postId: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPostById(postId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  return { data, loading, error };
};
