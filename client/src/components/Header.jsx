import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme-slice'
import { toast } from 'react-hot-toast'
import { resetTokenAndCredentials } from '../redux/auth-slice'

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const defaultImg =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname
  const dispatch = useDispatch()

  //* get selectors
  const { theme } = useSelector((state) => state.theme)
  const { currentUser } = useSelector((state) => state.auth)

  //* run a useffect to get the location
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }

    //* if searchTerm is trimmed and more than 3
    // if (searchTerm.trim() && searchTerm.length > 3) {
    // }
  }, [location.search])

  function handleSubmit(e) {
    e.preventDefault()
    //* we change the search term
    const urlParams = new URLSearchParams(location.search)
    //* set the search term to the state we have
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
    setSearchTerm('')
  }

  function handleSignout() {
    dispatch(resetTokenAndCredentials())
    localStorage.clear()
    toast.success('Logout Successful!')
    navigate('/auth/sign-in')
  }

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <h1 className='p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white text-[20px]'>
          Coderecur
        </h1>
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden sm:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button
        className='w-12 h-10 inline'
        color='gray'
        pill
        onClick={() => dispatch(toggleTheme())}
      >
        {theme === 'light' ? <FaSun size={16} /> : <FaMoon size={16} />}
        {/* {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />} */}
      </Button>
      <div className='flex gap-2 md:order-2'>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt='user'
                img={currentUser?.profilePicture || defaultImg}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser?.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser?.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/auth/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle className='lg:hidden' />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/search'} as={'div'}>
          <Link to='/search'>Search</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}
