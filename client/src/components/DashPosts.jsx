import React, { useEffect, useState } from 'react'
import { Modal, Table, Button, Spinner } from 'flowbite-react'
import { deletepost, getuserposts } from '../redux/post-slice'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function DashPosts() {
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth)
  const { posts, isLoading } = useSelector((state) => state.posts)
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState(null)

  const getPostsById = currentUser._id || currentUser.id

  useEffect(() => {
    dispatch(getuserposts(getPostsById))
  }, [dispatch])

  //* delete and then display all remaining posts
  const handleDeletePost = () => {
    dispatch(
      deletepost({
        userId: postIdToDelete?.userId,
        postId: postIdToDelete?._id,
      })
    )
      .then((data) => {
        if (data?.payload.success) {
          dispatch(getuserposts(getPostsById))
          toast.success(data.payload.message)
          setShowModal(false)
        }
      })
      .catch((error) => {
        toast.error('Something went wrong')
      })
  }

  //* handle edit
  // function handleEdit(post) {
  //   navigate('/create-post', { state: { post } })
  // }

  if (isLoading) {
    return (
      <div className=' mx-auto flex items-center mt-10'>
        <Spinner size='xl' />
      </div>
    )
  }

  //handle pageRouting
  if (!currentUser && !isAuthenticated) {
    return <Navigate to='/' replace />
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {posts && posts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              {/* <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell> */}
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {posts.map((post) => (
              <Table.Body className='divide-y' key={post._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  {/* <Table.Cell onClick={() => handleEdit(post)}>
                    <span className='cursor-pointer pointer'>Edit</span>
                  </Table.Cell> */}
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true)
                        setPostIdToDelete(post)
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no posts yet!</p>
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
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                // onClick={() => handleDeletePost(post._id)}
                // onClick={() => handleDeletePost(getCurrentPost)}
                onClick={handleDeletePost}
              >
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
