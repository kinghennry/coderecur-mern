import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Spinner } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './redux/auth-slice'

//* import pages & components
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import PostPage from './pages/PostPage'
import Search from './pages/Search'
import Dashboard from './pages/Dashboard'
import CreatePost from './pages/CreatePost'

export default function App() {
  const { currentUser, isLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    //* get the token from localStorage
    const token = JSON.parse(localStorage.getItem('token'))
    dispatch(checkAuth(token))
  }, [dispatch])
  if (isLoading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    )
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position='top-center' reverseOrder={false} />
      <Header />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='*' element={<NotFound />} />
        {/* logged-in user cannot access this route */}
        <Route path='/auth/sign-in' element={<SignIn />} />
        <Route path='/auth/sign-up' element={<SignUp />} />
        {/* loggedIn user cannot access this route */}
        <Route path='/create-post' element={<CreatePost />} />
        {/* <Route path='/update-post/:postId' element={<CreatePost />} /> */}
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/post/:postSlug' element={<PostPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
