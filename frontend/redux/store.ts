// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import likeReducer from "./likeSlice";
import chatReducer from "./chatSlice";
import infoReducer from "./infoSlice";
// Tạo store
const store = configureStore({
  reducer: {
    user: userReducer,
    like: likeReducer,
    chat: chatReducer,
    info: infoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt serializable check
      immutableCheck: false,
    }),
});

// Xuất store mặc định
export default store;

// Xuất RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
