// chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  currentChannelId: string | null;
}

const initialState: ChatState = {
  currentChannelId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChannelId: (state, action: PayloadAction<string>) => {
      state.currentChannelId = action.payload;
    },
  },
});

// Export actions and reducer
export const { setCurrentChannelId } = chatSlice.actions;
export default chatSlice.reducer;
