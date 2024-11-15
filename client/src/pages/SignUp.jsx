import { Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { signup } from '../redux/auth-slice'

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const { isLoading, registered, currentUser, isAuthenticated } = useSelector(
    (state) => state.auth
  )
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(signup(formData))
      .then((data) => {
        if (data?.payload?.success) {
          toast.success(data.payload.message)
        } else {
          toast.error(data.payload.message)
        }
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }

  if (currentUser && isAuthenticated) {
    return <Navigate to='/dashboard?tab=profile' replace />
  }
  if (registered) {
    return <Navigate to='/auth/sign-in' replace />
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Coderecur
            </span>
          </Link>
          <p className='text-sm mt-5'>
            Join us for the coolest coding content on the planet!. You can sign
            up with your email and password or with Google.
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/auth/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
