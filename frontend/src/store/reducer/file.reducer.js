import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../utils/axios.utils';

export const uploadFile = createAsyncThunk('file/uploadFile', async ({ fileSelected, onUploadProgress }) => {

  const formData = new FormData();
  formData.append("file", fileSelected);
  const response = await axiosInstance.post('/api/upload', formData, {onUploadProgress});
  console.log(response.data);
  return response.data;
})


export const file = createSlice({
  name: 'file',
  initialState: {
    fileLength: 0,
    loading: false,
    error: false,
    fileCached: null,
  },
  reducers: {

  },
  extraReducers: {
    [uploadFile.pending]: (state, action) => {
      state.loading = true;
      console.log('pendinggg', action);
    },
    [uploadFile.fulfilled]: (state, action) => {
      console.log(action.payload);
      const { fileCached, fileLength } = action.payload;
      state.fileCached = fileCached;
      state.fileLength = fileLength;
      state.loading = false;
    },
    [uploadFile.rejected]: (state, action) => {
      console.log("Could not upload file!");
      state.loading = false;
      state.error = true;
    }

  }
})

export default file.reducer;