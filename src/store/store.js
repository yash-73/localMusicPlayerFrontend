import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import trackReducer from './trackSlice';
import { saveTrackState } from '../helpers/trackStorage';

const store = configureStore({
  reducer: {
    user: userReducer,
    track: trackReducer,
  },
});

store.subscribe(() => {
  const { track } = store.getState();

  if (track?.id) {
    saveTrackState(track);
  }
});

export default store;
