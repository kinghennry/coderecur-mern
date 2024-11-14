import { Table, Spinner } from 'flowbite-react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { totalusers } from '../redux/users-slice'
import { Navigate } from 'react-router-dom'

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.auth)
  const { myUsers, isLoading } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentUser.isAdmin) {
      dispatch(totalusers())
    }
  }, [dispatch])

  if (isLoading) {
    return (
      <div className=' mx-auto flex items-center mt-10'>
        <Spinner size='xl' />
      </div>
    )
  }

  //handle pageRouting
  if (!currentUser) {
    return <Navigate to='/' replace />
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && myUsers.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
            </Table.Head>
            {myUsers.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
    </div>
  )
}
