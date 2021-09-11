import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../utils/axios.utils';

export const getFileData = createAsyncThunk('file/getFileData', async ({ fileSelected }) => {

  const formData = new FormData();
  formData.append("file", fileSelected);
  console.log('gete');
  const response = await axiosInstance.post('/api/upload', formData);
  return response.data;


})

export const file = createSlice({
  name: 'file',
  initialState: {
    fileData: [],
  },
  reducers: {

  },
  extraReducers: {
    [getFileData.fulfilled]: (state, action) => {
      state.fileData = action.payload;
      console.log(state.fileData);
    },
    [getFileData.rejected]: (state, action) => {
      console.log("Could not get data!")
    }

  }
})


export default file.reducer;