import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  // theme:
  // JSON.parse(localStorage.setItem('light')) ||
  // JSON.parse(localStorage.setItem('dark')),
  //light mode is the default
  // isDarkMode:
  //   localStorage.getItem('isDarkMode') != undefined
  //     ? JSON.parse(localStorage.getItem('isDarkMode'))
  //     : false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      // state.isDarkMode = !state.isDarkMode
      // localStorage.setItem('isDarkMode', state.isDarkMode)
      // state.theme = !state.theme
      // localStorage.setItem('light', JSON.stringify(state.theme))
    },
  },
})

export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer
