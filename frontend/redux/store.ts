// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import likeReducer from './likeSlice';
// Tạo store
const store = configureStore({
  reducer: {
    user: userReducer,
    like: likeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt serializable check
    })
});

// Xuất store mặc định
export default store;

// Xuất RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
