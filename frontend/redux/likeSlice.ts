import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCountLike } from '../src/hooks/fetchCountLike';
import { fetchCheckUserLike } from '../src/hooks/fetchCheckUserLike';


interface LikesState {
  likesState: { [key: string]: boolean };
  countLike: { [key: string]: number };
  isLoading: boolean;
}

const initialState: LikesState = {
  likesState: {},
  countLike: {},
  isLoading: false,
};

// Thunk để fetch số lượng like
export const fetchLikeCount = createAsyncThunk(
  'likes/fetchLikeCount',
  async (postId: string) => {
    const data = await fetchCountLike(postId);
    return data.count; // Nếu bạn muốn trả về số lượng likes
  }
);

// Thunk để kiểm tra xem người dùng đã like hay chưa
export const fetchUserLikeStatus = createAsyncThunk(
  'likes/fetchUserLikeStatus',
  async (postId: string) => {
    const data = await fetchCheckUserLike(postId);
    return data.isLiked; // Nếu bạn muốn trả về true/false
  }
);

const likeSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const postId = action.payload as string;
      state.likesState[postId] = !state.likesState[postId]; // Đảo ngược trạng thái
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikeCount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLikeCount.fulfilled, (state, action) => {
        state.isLoading = false;
        const postId = action.meta.arg;
        state.countLike[postId] = action.payload; // Cập nhật số lượng like
      })
      .addCase(fetchLikeCount.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchUserLikeStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserLikeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const postId = action.meta.arg;
        state.likesState[postId] = action.payload; // Cập nhật trạng thái like của người dùng
      })
      .addCase(fetchUserLikeStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { toggleLike } = likeSlice.actions;
export default likeSlice.reducer;
