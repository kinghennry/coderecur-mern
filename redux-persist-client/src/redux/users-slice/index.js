import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  totalUsers: 0,
  myUsers: [],
  lastMonthUsers: 0,
}

export const getallusers = createAsyncThunk('/users/getusers', async () => {
  const { data } = await axios.get(`/api/user/getusers?limit=5`)
  return data
})
export const totalusers = createAsyncThunk('/users/totalusers', async () => {
  const { data } = await axios.get(`/api/user/getusers`)
  return data
})
//deleteUser
export const deleteuser = createAsyncThunk('/auth/deleteUser', async (id) => {
  const { data } = await axios.delete(`/api/user/delete/${id}`)

  return data
})
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getallusers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getallusers.fulfilled, (state, action) => {
        state.isLoading = false
        state.myUsers = action.payload.users
        state.totalUsers = action.payload.totalUsers
        state.lastMonthUsers = action.payload.lastMonthUsers
      })
      .addCase(getallusers.rejected, (state) => {
        state.isLoading = false
        state.myUsers = []
        state.totalUsers = 0
        state.lastMonthUsers = 0
      })
      .addCase(totalusers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(totalusers.fulfilled, (state, action) => {
        state.isLoading = false
        state.myUsers = action.payload.users
      })
      .addCase(totalusers.rejected, (state) => {
        state.isLoading = false
        state.myUsers = []
      })
  },
})

export default userSlice.reducer
