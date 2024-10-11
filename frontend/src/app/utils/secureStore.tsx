import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { localhost } from '../constants/localhost';

interface DecodedToken {
  id: string;  
  avatar_url?: string;
  behavior?: number;
  exp?: number;
}

export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync('accessToken', token);
  } catch (error) {
    console.error('Error saving access token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync('accessToken');
    return token;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};
export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('accessToken');
  } catch (error) {
    console.error('Error deleting access token:', error);
  }
};


export const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
    const userId = decodedToken.id;
    
    if (!userId) {
      console.error('Invalid token, no user ID found');
      return null;
    }

    return userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getAvatarUrlFromToken = async (): Promise<string | null> => {
  try {
    // Xóa cache mỗi khi hàm được gọi

    const token = await getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
    const avatarUrl = decodedToken.avatar_url || null;

    return avatarUrl;
  } catch (error) {
    console.error('Error getting avatar URL:', error);
    return null;
  }
};

export const getBehaviorFromToken = async (): Promise<number> => {
  try {
    // Lấy token từ hàm getToken()
    const token = await getToken();
    if (!token) {
      throw new Error('No token found');
    }
    
    const behavior = await fetch (`${localhost}/users/behavior`,{
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });




    // // Giải mã token để lấy behavior
    // const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
    // const behavior = decodedToken.behavior || 0; // Sử dụng 0 làm giá trị mặc định nếu behavior là falsy

    // Lưu behavior vào SecureStore
    await SecureStore.setItemAsync('behavior', behavior.toString());
    const behaviorData = await behavior.json();
    // console.log('Behavior:', behaviorData);
    return behaviorData;

  } catch (error) {
    console.error('Error getting behavior:', error);
    return 0; // Trả về 0 khi có lỗi
  }
};

// Hàm lấy behavior từ SecureStore
export const getCachedBehavior = async (): Promise<number> => {
  try {
    const behaviorString = await SecureStore.getItemAsync('behavior');
    if (behaviorString !== null) {
      return parseInt(behaviorString, 10);
    }
    return 0; // Trả về 0 thay vì null
  } catch (error) {
    console.error('Error getting cached behavior:', error);
    return 0; // Trả về 0 khi có lỗi
  }
};
export const setCacheBehavior = async (behavior: number): Promise<void> => {
  try {
    // Chuyển behavior thành chuỗi và lưu vào SecureStore
    await SecureStore.setItemAsync('behavior', behavior.toString());
    console.log('Behavior has been cached successfully.');
  } catch (error) {
    console.error('Error setting cache behavior:', error);
  }
};
export const clearUserCache = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync('userAvatarUrl');
    await SecureStore.deleteItemAsync('behavior');
  } catch (error) {
    console.error('Error clearing user cache:', error);
  }
};

export const logout = async (): Promise<void> => {
  await clearUserCache();
  await deleteToken();
};
