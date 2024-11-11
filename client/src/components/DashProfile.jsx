import { Button, Modal, ModalBody, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  connectStorageEmulator,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { resetTokenAndCredentials, updateuser } from '../redux/auth-slice'
import { deleteuser } from '../redux/users-slice'

export default function DashProfile() {
  const defaultImg =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'

  const { currentUser, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  )
  //* formData
  const [formData, setFormData] = useState({})
  //* large image file state
  const [imageFile, setImageFile] = useState(null)
  //* image file url
  const [imageFileUrl, setImageFileUrl] = useState(null)
  //* useRef to reference input file when u click  on profile image
  const filePickerRef = useRef()
  //* check image file upload
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  //* image uploading
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  //* input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }
  const handleImageChange = (e) => {
    //* first check if file exist,if it does then send to
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      //* then create the imageFileUrl with the URL.createObject method
      setImageFileUrl(URL.createObjectURL(file))
    }
  }
  const getProfileId = currentUser?.id || currentUser?._id
  const handleSignout = () => {
    dispatch(resetTokenAndCredentials())
    localStorage.clear()
    toast.success('Logout Successful!')
    navigate('/auth/sign-in')
  }
  const [showModal, setShowModal] = useState(false)
  const handleDeleteUser = () => {
    dispatch(deleteuser(deleteUserId))
      .then((data) => {
        if (data?.payload?.success) {
          toast.success(`Goodbye, ${currentUser.username}`)
          setShowModal(false)
          dispatch(resetTokenAndCredentials())
          localStorage.clear()
        } else {
          toast.error('Error Occurred')
        }
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    //* if there is no input
    if (Object.keys(formData).length === 0) {
      toast.error('No changes made')
      return
    }

    if (formData.password && formData.password.length < 8) {
      toast.error('Password must be at least 8 characters!')
      return
    } else if (
      (formData.username && formData.username.length < 3) ||
      (formData.username && formData.username.length > 20)
    ) {
      toast.error('Username must be between 3 and 20 characters!')
      return
    } else if (formData.username && formData.username.includes(' ')) {
      toast.error('Username cannot contain spaces!')
      return
    } else if (
      formData.username &&
      !formData.username.match(/^[a-zA-Z0-9]+$/)
    ) {
      toast.error('Username can only contain letters and numbers!')
      return
    } else if (
      formData.username &&
      formData.username !== formData.username.toLowerCase()
    ) {
      toast.error('Username must be lowercase!')
      return
    }

    //* return and fix this bug

    // console.log(formData, 'formData')
    dispatch(updateuser({ userId: getProfileId, formData }))
      .then((data) => {
        if (data.payload.success) {
          navigate(`/dashboard?tab=profile`)
          toast.success(`Profile updated!`)
        } else {
          toast.error(data.payload.message)
        }
      })
      .catch((e) => {
        toast.error(e.message)
      })
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  const uploadImage = async () => {
    //* get storage
    const storage = getStorage(app)
    //* get the filename
    const fileName = new Date().getTime() + imageFile.name
    //* store the file
    const storageRef = ref(storage, fileName)
    //* begin uploadTask
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        //* to remove it's decimal, add toFixed
        setImageFileUploadProgress(progress.toFixed(0))
      },
      (error) => {
        toast.error('Could not upload image (File must be less than 2MB)')
        setImageFileUploadProgress(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL)
          setFormData({ ...formData, profilePicture: downloadURL })
          setImageFileUploading(false)
        })
      }
    )
  }

  //* handle pageRouting
  if (!isAuthenticated && !currentUser) {
    return <Navigate to='/' replace />
  }

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      //  return <Navigate to='/' replace />
      navigate('/')
    }
  }, [currentUser])

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser?.profilePicture || defaultImg}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />

        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={isLoading || imageFileUploading}
        >
          {isLoading ? 'Loading...' : 'Update'}
        </Button>
        <Link to={'/create-post'}>
          <Button
            type='button'
            gradientDuoTone='purpleToPink'
            className='w-full'
          >
            Create a post
          </Button>
        </Link>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span
          onClick={() => {
            setShowModal(true)
            setDeleteUserId(currentUser?.id || currentUser?._id)
          }}
          className='cursor-pointer'
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className='cursor-pointer'>
          Sign Out
        </span>
      </div>

      {/* modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
