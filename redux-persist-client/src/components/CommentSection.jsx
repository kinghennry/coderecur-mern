import { Button, Modal, Spinner, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Comment from './Comment'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import {
  addcomments,
  deletecomments,
  getpostscomments,
  likecomment,
} from '../redux/comments-slice'

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.auth)
  const { isLoading, comments } = useSelector((state) => state.comments)
  const [content, setContent] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getpostscomments(postId))
  }, [postId])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      content,
      postId: postId,
      userId: currentUser._id,
      username: currentUser.username,
      image: currentUser.profilePicture,
    }
    dispatch(addcomments(formData))
      .then((data) => {
        if (data?.meta?.requestStatus === 'fulfilled') {
          toast.success(`Comment added`)
          dispatch(getpostscomments(postId))
          setContent('')
        } else {
          toast.error('Error Occurred')
        }
      })
      .catch((err) => {
        toast.error('Something went wrong')
      })
  }
  const handleDeleteComment = () => {
    dispatch(deletecomments(commentToDelete))
      .then((data) => {
        if (data?.meta?.requestStatus === 'fulfilled') {
          toast.success(`Comment deleted`)
          setShowModal(false)
          dispatch(getpostscomments(postId))
        } else {
          toast.error('Error Occurred')
        }
      })
      .catch((err) => {
        toast.error('Something went wrong')
      })
  }
  const handleLike = (commentId) => {
    dispatch(likecomment(commentId))
      .then((data) => {
        if (data?.meta?.requestStatus === 'fulfilled') {
          setShowModal(false)
          dispatch(getpostscomments(postId))
        } else {
          toast.error('Error Occurred')
        }
      })
      .catch((err) => {
        toast.error('Something went wrong')
      })
  }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={currentUser?.profilePicture}
            alt=''
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser?.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment.
          <Link className='text-blue-500 hover:underline' to={'/auth/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className='border border-teal-500 rounded-md p-3'
        >
          <Textarea
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>
              {200 - content.length} characters remaining
              {/* code above checks d comment length */}
            </p>
            <Button
              outline
              gradientDuoTone='purpleToBlue'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? '......' : 'Submit'}
            </Button>
          </div>
        </form>
      )}
      {isLoading && (
        <div className=' mx-auto justify-center  flex items-center mt-10'>
          <Spinner size='xl' />
        </div>
      )}
      {comments && comments.length > 0 ? (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              onLike={handleLike}
              key={comment._id}
              commentItem={comment}
              onDelete={(commentId) => {
                setShowModal(true)
                setCommentToDelete(commentId)
              }}
            />
          ))}
        </>
      ) : (
        <p className='text-sm my-5'>No comments yet!</p>
      )}

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
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
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
