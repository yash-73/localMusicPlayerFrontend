import { createSlice } from "@reduxjs/toolkit";

const LAST_PLAYED_LIMIT = 50;

const lastPlayedSlice = createSlice({
  name: "lastPlayed",
  initialState: {
    history: []
  },
  reducers: {
    addTrack(state, action) {
      const track = action.payload;

      // Avoid duplicate consecutive entries
      const last = state.history[state.history.length - 1];
      if (last && last.id === track.id) return;

      if (state.history.length === LAST_PLAYED_LIMIT) {
        state.history.shift(); // remove oldest
      }

      state.history.push(track); // newest at end
    },

    skipBackward(state) {
      if (state.history.length <= 1) return;

      // Remove the last track
      state.history.pop();
    },

    clearHistory(state) {
      state.history = [];
    }
  }
});

export const { addTrack, skipBackward, clearHistory } =
  lastPlayedSlice.actions;

export default lastPlayedSlice.reducer;
