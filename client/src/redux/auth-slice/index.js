import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  currentUser: null,
  isLoading: true,
  token: null,
  googleLoading: false,
  isAuthenticated: false,
  registered: false,
}

export const signup = createAsyncThunk('/auth/signup', async (formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SERVER}/api/auth/signup`,
    formData,
    {
      withCredentials: true,
    }
  )

  return data
})

export const signin = createAsyncThunk('/auth/signin', async (formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_SERVER}/api/auth/signin`,
    formData,
    {
      withCredentials: true,
    }
  )
  return data
})

export const checkAuth = createAsyncThunk(
  '/auth/checkauth',

  async (token) => {
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/auth/check-auth`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
    return res.data
  }
)

export const updateuser = createAsyncThunk(
  '/auth/updateuser',
  async ({ userId, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_SERVER}/api/user/update/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
    return result?.data
  }
)

// export const googlesignin =
export const googlesignin = createAsyncThunk(
  '/auth/googlesignin',
  async (result) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_SERVER}/api/auth/google`,
      result,
      {
        withCredentials: true,
        header: {
          'Content-Type': 'application/json',
        },
      }
    )
    return data
    // try {
    // const res = await axios.post(
    // `${import.meta.env.VITE_SERVER}/api/auth/google`,
    // result,
    // {
    // header: {
    // 'Content-Type': 'application/json',
    // },
    // }
    // )
    // if (res?.status === 200) {
    //   navigate('/dashboard?tab=profile')
    //   toast.success(`Welcome ${res.data.user.username}!`)
    // }
    // return res.data
    // } catch (err) {
    // toast.error(err?.response?.data?.message)
    // }
  }
)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {},
    resetTokenAndCredentials: (state) => {
      state.currentUser = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true
        state.isAuthenticated = false
        state.registered = false
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = null
        state.isAuthenticated = false
        state.registered = action.payload.success
      })
      .addCase(signup.rejected, (state) => {
        state.isLoading = false
        state.currentUser = null
        state.isAuthenticated = false
        state.registered = false
      })
      .addCase(signin.pending, (state) => {
        state.isLoading = true
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload.user
        state.isAuthenticated = action.payload.success
        state.token = action.payload.token
        localStorage.setItem('token', JSON.stringify(action.payload.token))
      })
      .addCase(signin.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.currentUser = null
        state.token = null
      })
      // .addCase(logoutUser.fulfilled, (state) => {
      //   state.isLoading = false
      //   state.currentUser = null
      // })
      .addCase(googlesignin.pending, (state) => {
        state.googleLoading = true
      })
      .addCase(googlesignin.fulfilled, (state, action) => {
        state.googleLoading = false
        state.currentUser = action.payload.user
        state.isAuthenticated = action.payload.success
        state.token = action.payload.token
        localStorage.setItem('token', JSON.stringify(action.payload.token))
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
        state.currentUser = action.payload.success ? action.payload.user : null
      })
      .addCase(updateuser.rejected, (state) => {
        state.isLoading = false
        state.currentUser = null
      })

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload.success ? action.payload.user : null
        state.isAuthenticated = action.payload.success
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.currentUser = null
      })
  },
})

export const { setUser, resetTokenAndCredentials } = authSlice.actions

export default authSlice.reducer
