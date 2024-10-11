// redux/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;  // Change from id to _id
  full_name: string;
  gender: string;
  bio: string;
  avatar_url: string;
  behavior: number;
}

interface UserState {
  data: User[];
  selectedId: number ;
}

const initialState: UserState = {
  data: [], // Load dữ liệu từ API hoặc file
  selectedId: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<User[]>) => {
      state.data = action.payload;
    },
    setSelectedId: (state, action: PayloadAction<number>) => {
      state.selectedId = action.payload;
    },
  },
});

export const { setData, setSelectedId } = userSlice.actions;
export default userSlice.reducer;
