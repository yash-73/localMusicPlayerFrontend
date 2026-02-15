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
    albumName: null,
    artists: []
}
: 
persisted ?? {
      id: null,
      name: null,
      durationSeconds: 0,
      currentTime: 0,
      volume: 0.5,
      isPlaying: false,
      albumName: null,
      artists: []
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
            state.isPlaying = true;
            state.albumName = action.payload.albumName,
            state.artists = action.payload.artists
        },

        setId: (state, action) => {
            state.id = action.payload;
        },

        clearTrack: (state, action)=>{
            state.id = null,
            state.name = null,
            state.durationSeconds = 0,
            state.currentTime = 0,
            state.isPlaying = false,
            state.albumName = null,
            state.artists = []
            
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
    setId,
    clearTrack,
    setCurrentTime,
    setVolume,
    togglePlay,
    setIsPlaying,
    setDuration
} = trackSlice.actions;

export default trackSlice.reducer;

