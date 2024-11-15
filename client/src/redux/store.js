import { configureStore, combineReducers } from '@reduxjs/toolkit'
import themeSlice from './theme-slice'
import postSlice from './post-slice'
import authSlice from './auth-slice'
import commentSlice from './comments-slice'
import userSlice from './users-slice'
import shopSearchSlice from './search-slice'

// const persistConfig = {
//   key: 'root',
//   storage,
//   version: 1,
// }

const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  posts: postSlice,
  comments: commentSlice,
  shopSearch: shopSearchSlice,
  user: userSlice,
})

// const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  // reducer: persistedReducer,
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  // getDefaultMiddleware({ serializableCheck: false }),
})

// export const persistor = persistStore(store)
