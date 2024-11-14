import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { app } from '../firebase.js'
import { googlesignin } from '../redux/auth-slice'

export default function OAuth() {
  const { googleLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      const formData = await signInWithPopup(auth, provider)
      const email = formData?.user?.email
      const name = formData?.user?.displayName
      const picture = formData?.user?.photoURL
      const result = { email, picture, name }
      dispatch(googlesignin({ result, toast, navigate }))
    } catch (error) {
      toast.error('something went wrong')
      console.log(error)
    }
  }

  return (
    <Button
      type='button'
      gradientDuoTone='pinkToOrange'
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      {googleLoading ? 'Loading...' : 'Continue with google'}
    </Button>
  )
}
