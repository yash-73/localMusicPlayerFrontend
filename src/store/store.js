import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import trackReducer from './trackSlice';
import lastPlayedReducer from './lastPlayedSlice'
import queuedTracksReducer from './queuedTracksSlice';
import { saveTrackState } from '../helpers/trackStorage';

const store = configureStore({
  reducer: {
    user: userReducer,
    track: trackReducer,
    lastPlayed: lastPlayedReducer,
    queuedTracks: queuedTracksReducer
  },
});

store.subscribe(() => {
  const { track } = store.getState();

  if (track?.id) {
    saveTrackState(track);
  }
});

export default store;
