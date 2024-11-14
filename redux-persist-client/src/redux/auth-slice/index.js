import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  currentUser: null,
  isLoading: false,
  token: null,
  googleLoading: false,
}

export const signup = createAsyncThunk(
  '/auth/signup',
  async ({ formData, toast, navigate }) => {
    try {
      const res = await axios.post(`/api/auth/signup`, formData, {
        withCredentials: true,
      })
      console.log(res)
      if (res?.status === 201) {
        navigate('/auth/sign-in')
        toast.success(res.data)
      }
      return res.data
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }
  }
)
export const signin = createAsyncThunk(
  '/auth/signin',
  async ({ formData, toast, navigate }) => {
    try {
      const res = await axios.post(`/api/auth/signin`, formData, {
        withCredentials: true,
      })
      if (res?.status === 200) {
        navigate('/dashboard?tab=profile')
        toast.success(`Welcome ${res.data.username}!`)
      }
      return res.data
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }
  }
)

export const logoutUser = createAsyncThunk(
  '/auth/logout',

  async () => {
    const response = await axios.post(
      `/api/user/signout`,
      {},
      {
        withCredentials: true,
      }
    )

    return response.data
  }
)

// export const googlesignin =
export const googlesignin = createAsyncThunk(
  '/auth/googlesignin',
  async ({ result, toast, navigate }) => {
    try {
      const res = await axios.post(`/api/auth/google`, result, {
        header: {
          'Content-Type': 'application/json',
        },
      })
      console.log(res)
      if (res?.status === 200) {
        navigate('/dashboard?tab=profile')
        toast.success(`Welcome ${res.data.username}!`)
      }
      return res.data
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }
  }
  //   async (result) => {
  //     const { data } = await axios.post(`${server}/auth/google`, result, {
  //       withCredentials: true,
  //       header: {
  //         'Content-Type': 'application/json',
  //       },
  //     })

  //     return data
  // try {
  //   const res = await axios.post(
  //     `http://localhost:3000/api/auth/google`,
  //     result,
  //     {
  //       withCredentials: true,
  //       header: {
  //         'Content-Type': 'application/json',
  //       },
  //     }
  //   )
  //   toast.success('Google Sign-in Successful')
  //   navigate('/user/create-listing')
  //   return res.data
  // } catch (error) {
  //   console.log(error)
  //   return rejectWithValue(error.response.data)
  // }
  // }
)

export const updateuser = createAsyncThunk(
  '/auth/updateuser',
  async ({ userId, formData, navigate, toast }) => {
    try {
      const res = await axios.put(`/api/user/update/${userId}`, formData, {
        withCredentials: true,
        header: {
          'Content-Type': 'application/json',
        },
      })
      if (res?.status === 200) {
        navigate(`/dashboard?tab=profile`)
        toast.success(`Profile updated!`)
      }
      return res.data
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signup.fulfilled, (state) => {
        state.isLoading = false
        state.currentUser = null
      })
      .addCase(signup.rejected, (state) => {
        state.isLoading = false
        state.currentUser = null
      })
      .addCase(signin.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
      })
      .addCase(signin.rejected, (state) => {
        state.isLoading = false
        state.currentUser = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.currentUser = null
      })
      .addCase(googlesignin.pending, (state) => {
        state.googleLoading = true
      })
      .addCase(googlesignin.fulfilled, (state, action) => {
        state.googleLoading = false
        console.log(action)
        state.currentUser = action.payload
      })
      .addCase(googlesignin.rejected, (state) => {
        state.googleLoading = false
        state.currentUser = null
      })
      .addCase(updateuser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateuser.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
      })
      .addCase(updateuser.rejected, (state) => {
        state.isLoading = false
        state.currentUser = null
      })

    // .addCase(checkAuth.pending, (state) => {
    //   state.isLoading = true
    // })
    // .addCase(checkAuth.fulfilled, (state, action) => {
    //   state.isLoading = false
    //   state.currentUser = action.payload.success ? action.payload.user : null
    //   state.isAuthenticated = action.payload.success
    // })
    // .addCase(checkAuth.rejected, (state) => {
    //   state.isLoading = false
    //   state.currentUser = null
    //   state.isAuthenticated = false
    // })
  },
})

export const {
  // updateStart,
  // updateSuccess,
  // updateFailure,
  setUser,
  // resetTokenAndCredentials,
} = authSlice.actions

export default authSlice.reducer
