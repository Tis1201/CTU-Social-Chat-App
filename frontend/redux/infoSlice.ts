// src/redux/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string | null;
  avatarUrl: string | null;
}

const initialState: UserState = {
  username: null,
  avatarUrl: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ username: string; avatarUrl: string }>) => {
      state.username = action.payload.username;
      state.avatarUrl = action.payload.avatarUrl;
    },
    clearUser: (state) => {
      state.username = null;
      state.avatarUrl = null;
    },
  },
});

// Export các action
export const { setUser, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
