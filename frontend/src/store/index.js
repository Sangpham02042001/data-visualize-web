import { configureStore } from '@reduxjs/toolkit'
import fileReducer from './reducer/file.reducer';

export default configureStore({
  reducer: {
    fileReducer,
  },
})