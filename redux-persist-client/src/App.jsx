import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
// import SignIn from './pages/SignIn'
// import Dashboard from './pages/Dashboard'
// import SignUp from './pages/SignUp'
import Header from './components/Header'
import Footer from './components/Footer'
// import CreatePost from './pages/CreatePost'
// import PostPage from './pages/PostPage'
import ScrollToTop from './components/ScrollToTop'
// import Search from './pages/Search'
import { Toaster } from 'react-hot-toast'
// import { useSelector, useDispatch } from 'react-redux'
// import { checkAuth } from './redux/auth-slice'
// import { Spinner } from 'flowbite-react'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position='top-center' reverseOrder={false} />
      <Header />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        {/* <Route path='/search' element={<Search />} /> */}
        <Route path='*' element={<NotFound />} />
        {/* logged-in user cannot access this route */}
        {/* <Route path='/auth/sign-in' element={<SignIn />} /> */}
        {/* <Route path='/auth/sign-up' element={<SignUp />} /> */}
        {/* loggedIn user cannot access this route */}
        {/* <Route path='/create-post' element={<CreatePost />} /> */}
        {/* <Route path='/update-post/:postId' element={<CreatePost />} /> */}
        {/* <Route path='/dashboard' element={<Dashboard />} /> */}
        {/* <Route path='/post/:postSlug' element={<PostPage />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
