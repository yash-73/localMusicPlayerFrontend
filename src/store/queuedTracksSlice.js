import { createSlice } from "@reduxjs/toolkit";

const queuedTracksSlice = createSlice({
  name: "queuedTracks",
  initialState: {
    queue: [],
  },
  reducers: {
    addTrack(state, action) {
      const track = action.payload;
      state.queue.push(track); // Add to end of queue
    },

    addTrackToFront(state, action) {
      const track = action.payload;
      state.queue.unshift(track); // Add to front of queue (plays next)
    },

    removeFirstTrack(state) {
      if (state.queue.length > 0) {
        state.queue.shift(); // Remove first track
      }
    },

    removeTrackById(state, action) {
      const trackId = action.payload;
      state.queue = state.queue.filter(track => track.id !== trackId);
    },

    clearQueue(state) {
      state.queue = [];
    }
  }
});

export const { addTrack, addTrackToFront, removeFirstTrack, removeTrackById, clearQueue } =
  queuedTracksSlice.actions;

export default queuedTracksSlice.reducer;
