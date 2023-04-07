import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features-not-used/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
