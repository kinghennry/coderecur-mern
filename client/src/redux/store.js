import { configureStore, combineReducers } from '@reduxjs/toolkit'
// import { persistReducer, persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import authSlice fro../../picaboo-client/redux/auth-sliceice'
// import themeSlice fro../../picaboo-client/redux/theme-sliceice'
import postSlice from './post-slice'
// import commentSlice fro../../picaboo-client/redux/comments-sliceice'
// import userSlice fro../../picaboo-client/redux/users-sliceice'
import shopSearchSlice from './search-slice'

// const persistConfig = {
//   key: 'root',
//   storage,
//   version: 1,
// }

const rootReducer = combineReducers({
  // auth: authSlice,
  // theme: themeSlice,
  posts: postSlice,
  // comments: commentSlice,
  shopSearch: shopSearchSlice,
  // user: userSlice,
})

// const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  // reducer: persistedReducer,
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  // getDefaultMiddleware({ serializableCheck: false }),
})

// export const persistor = persistStore(store)
