import { Button, FileInput, Select, Spinner, TextInput } from 'flowbite-react'
import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase'
import { useNavigate, Navigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { addPosts, updatePosts } from '../redux/post-slice'
import { useDispatch, useSelector } from 'react-redux'

export default function CreatePost() {
  const [formData, setFormData] = useState({})
  const [isEdited, setIsEdited] = useState(false)
  const { currentUser } = useSelector((state) => state.auth)
  const { isLoading, posts } = useSelector((state) => state.posts)
  const location = useLocation()
  // get image file
  const [file, setFile] = useState(null)
  //image upload error
  const [imageUploadError, setImageUploadError] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    //**1. if there is an item passed
    if (location.state) {
      const { post } = location.state
      setIsEdited(true)
      setFormData({
        title: post?.title,
        category: post?.category,
        content: post?.content,
        image: post?.image,
      })
    }
  }, [location])
  // edit

  console.log(location)

  const handleUploadImage = async () => {
    try {
      if (!file) {
        toast.error('Please select an image')
        return
      }
      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageUploadProgress(progress.toFixed(0))
        },
        (error) => {
          toast.error('Image upload failed')
          setImageUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null)
            setImageUploadError(null)
            setFormData({ ...formData, image: downloadURL })
          })
        }
      )
    } catch (error) {
      toast.error('Image upload failed')
      setImageUploadProgress(null)
    }
  }
  function handleSubmit(e) {
    e.preventDefault()
    const formItem = { ...formData, userId: currentUser?._id }
    const updatedFormItem = {
      ...formData,
    }
    isEdited !== false
      ? dispatch(
          updatePosts({
            updatedFormItem,
            userId: location?.state?.post?.userId,
            postId: location?.state?.post?._id,
            toast,
            navigate,
          })
        )
      : dispatch(addPosts({ formItem, toast, navigate }))
  }

  if (!currentUser) {
    return <Navigate to='/' replace />
  }

  console.log(formData, 'formData')
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        {isEdited ? 'Update this' : 'Create new'} recur
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            defaultValue={formData.title}
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            defaultValue={formData?.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React-js</option>
            <option value='nextjs'>Next-js</option>
            <option value='nextjs'>Typescript</option>
          </Select>
        </div>
        <div className='flex flex-col md:flex-row gap-4 md:items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          defaultValue={formData?.content}
          onChange={(value) => {
            setFormData({ ...formData, content: value })
          }}
        />
        <Button type='submit' gradientDuoTone='purpleToPink'>
          {isLoading ? (
            <>
              <Spinner size='sm' />
              <span className='pl-3'>Loading...</span>
            </>
          ) : (
            <>{isEdited ? 'Update this recur ' : 'Create new recur'}</>
          )}
        </Button>
      </form>
    </div>
  )
}
