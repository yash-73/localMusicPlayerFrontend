import {createSlice} from '@reduxjs/toolkit'

import { loadTrackState } from '../helpers/trackStorage'

const persisted = loadTrackState();

const initialState = persisted && !persisted.id
 ?  {
    id: null,
    name: null,
    durationSeconds: 0,
    currentTime: 0,
    volume: 0.5,
    isPlaying: false,
}
: 
persisted ?? {
      id: null,
      name: null,
      durationSeconds: 0,
      currentTime: 0,
      volume: 0.5,
      isPlaying: false,
    };

const trackSlice = createSlice({

    name: 'track',

    initialState,

    reducers: {
        setTrack: (state, action)=>{
            state.id = action.payload.id,
            state.name = action.payload.name,
            state.durationSeconds == action.payload.durationSeconds,
            state.currentTime = 0,
            state.isPlaying = true
        },

        clearTrack: (state, action)=>{
            state.id = null,
            state.name = null,
            state.durationSeconds = 0,
            state.currentTime = 0,
            state.isPlaying = false
        },
        
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },

        setVolume: (state, action) => {
            state.volume = action.payload;
        },

        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
        },

        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },

        setDuration : (state,action)=>{
            state.durationSeconds = action.durationSeconds;
        }

    }
})


export const {
    setTrack ,
    clearTrack,
    setCurrentTime,
    setVolume,
    togglePlay,
    setIsPlaying,
    setDuration
} = trackSlice.actions;

export default trackSlice.reducer;

