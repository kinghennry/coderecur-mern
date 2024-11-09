import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { Provider } from 'react-redux'
// import { store, persistor } fro../picaboo-client/redux/store.js.js'
// import { PersistGate } from 'redux-persist/integration/react'
// import ThemeProvider fro../picaboo-client/components/ThemeProvider.jsxder'

createRoot(document.getElementById('root')).render(
  // <PersistGate persistor={persistor}>
  // <Provider store={store}>
  // <ThemeProvider>
  <App />
  // </ThemeProvider>
  // </Provider>
  // </PersistGate>
)
