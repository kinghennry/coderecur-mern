import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  posts: [],
  totalPosts: 0,
  recentPosts: [],
  lastMonthPosts: 0,
  singlePost: null,
}

//addPosts
export const addPosts = createAsyncThunk(
  '/post/create',
  async ({ formItem, toast, navigate }) => {
    try {
      const res = await axios.post(`/api/post/create`, formItem, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      if (res?.status === 201) {
        navigate(`/post/${res.data.slug}`)
        toast.success(`New Recur Created!`)
      }
      return res.data
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }
  }
)

export const updatePosts = createAsyncThunk(
  '/post/update',
  async ({ updatedFormItem, userId, postId, navigate, toast }) => {
    try {
      const res = await axios.put(
        `/api/post/updatepost/${postId}/${userId}`,
        updatedFormItem,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      if (res?.status === 200) {
        navigate(`/post/${res.data.slug}`)
        toast.success(` Recur Updated!`)
      }
      return res.data
    } catch (err) {
      toast.error(err?.response?.data?.message)
    }
  }
)
//getUserPosts
export const getuserposts = createAsyncThunk(
  '/posts/getuserposts',
  async ({ userId, toast }) => {
    try {
      const res = await axios.get(`/api/post/getposts?userId=${userId}`)
      return res.data
    } catch (err) {
      toast.error('Something went wrong')
    }
  }
)
export const deletepost = createAsyncThunk(
  '/post/deletepost',
  async ({ postId, userId }) => {
    const { data } = await axios.delete(
      `/api/post/deletepost/${postId}/${userId}`
    )
    return data
  }
)
export const getsinglepost = createAsyncThunk(
  '/post/getsinglepost',
  async (postSlug) => {
    const res = await axios.get(`/api/post/getposts?slug=${postSlug}`)
    return res.data
  }
)
//recentPosts
export const recentposts = createAsyncThunk('/post/recentposts', async () => {
  const { data } = await axios.get(`/api/post/getposts?limit=3`)
  return data
})

export const getposts = createAsyncThunk('/post/getposts', async () => {
  const { data } = await axios.get(`/api/post/getposts`)
  return data
})
export const dashboardposts = createAsyncThunk(
  '/post/dashboardposts',
  async () => {
    const { data } = await axios.get(`/api/post/getposts?limit=5`)
    return data
  }
)

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPosts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addPosts.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts = action.payload
      })
      .addCase(addPosts.rejected, (state) => {
        state.isLoading = false
        state.posts = []
      })
      .addCase(getposts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getposts.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts = action.payload.posts
      })
      .addCase(getposts.rejected, (state) => {
        state.isLoading = false
        state.posts = []
      })
      .addCase(recentposts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(recentposts.fulfilled, (state, action) => {
        state.isLoading = false
        state.recentPosts = action.payload.posts
      })
      .addCase(recentposts.rejected, (state) => {
        state.isLoading = false
        state.recentPosts = []
      })
      .addCase(getsinglepost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getsinglepost.fulfilled, (state, action) => {
        state.isLoading = false
        state.singlePost = action.payload.posts
      })
      .addCase(getsinglepost.rejected, (state) => {
        state.isLoading = false
        state.singlePost = null
      })
      .addCase(dashboardposts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(dashboardposts.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts = action.payload.posts
        state.totalPosts = action.payload.totalPosts
        state.lastMonthPosts = action.payload.lastMonthPosts
      })
      .addCase(dashboardposts.rejected, (state) => {
        state.isLoading = false
        state.posts = []
        state.totalPosts = 0
        state.lastMonthPosts = 0
      })
      .addCase(getuserposts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getuserposts.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts = action.payload.posts
      })
      .addCase(getuserposts.rejected, (state) => {
        state.isLoading = false
        state.posts = []
      })
  },
})

export default postSlice.reducer
