import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../utils/axios.utils';

export const getFileData = createAsyncThunk('file/getFileData', async ({ fileSelected }) => {

  const formData = new FormData();
  formData.append("file", fileSelected);
  console.log('gete');
  const onUploadProgress = (progressEvent) => {
    if (progressEvent.total) {
      console.log(progressEvent.loaded / progressEvent.total);
    } else {
      console.log(progressEvent.loaded);
    }
  }
  const response = await axiosInstance.post('/api/upload', formData, {onUploadProgress});
  console.log(response.data);
  return response.data;


})

export const file = createSlice({
  name: 'file',
  initialState: {
    fileData: [],
  },
  reducers: {
    setFileData: (state, action) => {
      const {rowIndex, columnId, value} = action.payload;
      state.fileData.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...state.fileData[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    }
  },
  extraReducers: {
    [getFileData.pending]: (state, action) => {
      console.log('pendinggg');
    },
    [getFileData.fulfilled]: (state, action) => {
      state.fileData = action.payload;
      console.log(state.fileData);
    },
    [getFileData.rejected]: (state, action) => {
      console.log("Could not get data!")
    }

  }
})

export const { setFileData } = file.actions;
export default file.reducer;