import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  username: null,
  isAuthenticated: false,
  bootStrapped: false,
  darkMode: false
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

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    }

  },
});

export const { setUser, clearUser, toggleDarkMode } = userSlice.actions;
export default userSlice.reducer;