import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  lastMonthComments: 0,
  comments: [],
  totalComments: 0,
}
//addComments
export const addcomments = createAsyncThunk(
  '/comment/create',
  async (formData) => {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER}/api/comment/create`,
      formData,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return res.data
  }
)
export const getpostscomments = createAsyncThunk(
  '/comments/getpostscomments',
  async (postId) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/comment/getPostComments/${postId}`
    )
    return data
  }
)
export const getallcomments = createAsyncThunk(
  '/comments/getallcomments',
  async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/comment/getcomments?limit=5`
    )
    return data
  }
)
export const listofallcomments = createAsyncThunk(
  '/comments/listofallcomments',
  async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/comment/getcomments`
    )
    return data
  }
)
export const deletecomments = createAsyncThunk(
  '/comments/deletecomments',
  async (id) => {
    const { data } = await axios.delete(
      `${import.meta.env.VITE_SERVER}/api/comment/deleteComment/${id}`
    )

    return data
  }
)
export const likecomment = createAsyncThunk(
  '/comment/like',
  async ({ commentId, userId }) => {
    const { data } = await axios.put(
      `${
        import.meta.env.VITE_SERVER
      }/api/comment/likeComment/${commentId}/${userId}`
    )
    return data
  }
)
export const editcomment = createAsyncThunk(
  '/comment/edit',
  async ({ content, commentId }) => {
    const res = await axios.put(
      `${import.meta.env.VITE_SERVER}/api/comment/editComment/${commentId}`,
      content,
      {
        withCredentials: true,
      }
    )
    return res.data
  }
)

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addcomments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addcomments.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(addcomments.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getpostscomments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getpostscomments.fulfilled, (state, action) => {
        state.isLoading = false
        state.comments = action.payload.comments
      })
      .addCase(getpostscomments.rejected, (state, action) => {
        state.isLoading = false
        state.comments = []
      })
      .addCase(getallcomments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getallcomments.fulfilled, (state, action) => {
        state.isLoading = false
        state.comments = action.payload.comments
        state.totalComments = action.payload.totalComments
        state.lastMonthComments = action.payload.lastMonthComments
      })
      .addCase(getallcomments.rejected, (state) => {
        state.isLoading = false
        state.comments = []
        state.totalComments = 0
        state.lastMonthComments = 0
      })
      .addCase(listofallcomments.pending, (state) => {
        state.isLoading = true
      })
      .addCase(listofallcomments.fulfilled, (state, action) => {
        state.isLoading = false
        state.comments = action.payload.comments
      })
      .addCase(listofallcomments.rejected, (state) => {
        state.isLoading = false
        state.comments = []
      })
      .addCase(editcomment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(editcomment.fulfilled, (state, action) => {
        state.isLoading = false
        // state.comments = action.payload.editedComment
      })
      .addCase(editcomment.rejected, (state) => {
        state.isLoading = false
        // state.comments = []
      })
      .addCase(likecomment.fulfilled, (state, action) => {
        state.isLoading = false
        state.comments = action.payload.comment
      })
  },
})

export default commentSlice.reducer
