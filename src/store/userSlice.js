import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  username: null,
  isAuthenticated: false,
  bootStrapped: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.isAuthenticated = true;
      state.bootStrapped = true;
      
    },
    clearUser: (state) => {
      state.id = null;
      state.username = null;
      state.isAuthenticated = false;
      state.bootStrapped = true;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;