import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
// import { store, persistor } fro../picaboo-client/redux/store.js.js'
import { store } from './redux/store.js'
import ThemeProvider from './components/ThemeProvider.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* // <ThemeProvider> */}
    <App />
    {/* // </ThemeProvider> */}
  </Provider>
)
