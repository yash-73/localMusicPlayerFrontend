import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice';
import trackReducer from './trackSlice';

export const store = configureStore(
    {
        reducer: {
            user: userReducer,
            track: trackReducer
        }
    }
)