import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { Button, Textarea } from 'flowbite-react'
import { toast } from 'react-hot-toast'
import { editcomment, getpostscomments } from '../redux/comments-slice'

export default function Comment({ commentItem, onLike, onDelete }) {
  const { currentUser } = useSelector((state) => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(commentItem.content)
  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(commentItem.content)
  }
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getpostscomments(commentItem.postId))
  }, [dispatch])
  const handleSave = (e) => {
    e.preventDefault()
    const formData = {
      content: editedContent,
      postId: commentItem.postId,
      userId: commentItem?.userId,
      username: commentItem?.username,
      image: commentItem?.image,
    }
    dispatch(
      editcomment({
        content: formData,
        commentId: commentItem._id,
      })
    ).then((data) => {
      if (data?.meta?.requestStatus === 'fulfilled') {
        dispatch(getpostscomments(commentItem.postId))
        toast.success(`Comment updated`)
        setIsEditing(false)
      } else {
        toast.error('Error Occurred')
      }
    })
  }

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={commentItem?.image}
          alt={commentItem?.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate flex items-center '>
            {commentItem?.username
              ? `@${commentItem?.username}`
              : 'anonymous user'}{' '}
            &nbsp;
            {currentUser?.isAdmin ? (
              <span className='flex items-center mt-1 text-[10px] bg-[#111827] px-1 py-[0.4] rounded-sm'>
                ADMIN&nbsp;👩‍💻
              </span>
            ) : (
              ''
            )}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(commentItem?.createdAt).fromNow()}
          </span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline
                onClick={() => setIsEditing(null)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className='text-gray-500 pb-2'>{commentItem.content}</p>
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              <button
                type='button'
                onClick={() => onLike(commentItem._id)}
                className={`text-gray-400 hover:text-blue-500 
                  ${
                    currentUser &&
                    commentItem.likes.includes(currentUser._id) &&
                    '!text-blue-500'
                  }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {commentItem.numberOfLikes > 0 &&
                  commentItem.numberOfLikes +
                    ' ' +
                    (commentItem.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {currentUser &&
                (currentUser._id === commentItem.userId ||
                  currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='text-gray-400 hover:text-blue-500'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(commentItem._id)}
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
