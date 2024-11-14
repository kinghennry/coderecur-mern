import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getsinglepost, recentposts } from '../redux/post-slice'
import PostCard from '../components/PostCard.jsx'
import { Link, useParams } from 'react-router-dom'
import { Button, Spinner } from 'flowbite-react'
import CommentSection from '../components/CommentSection.jsx'

export default function PostPage() {
  //get the slug name for params
  const { postSlug } = useParams()
  const dispatch = useDispatch()
  const { recentPosts, singlePost, isLoading } = useSelector(
    (state) => state.posts
  )

  //get single postSlug
  useEffect(() => {
    if (postSlug) {
      dispatch(getsinglepost(postSlug))
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postSlug])

  // get all recentPosts
  useEffect(() => {
    dispatch(recentposts())
  }, [dispatch])
  const pagePost = singlePost?.[0]

  if (isLoading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    )

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {pagePost && pagePost.title}
      </h1>
      <Link
        to={`/search?category=${pagePost && pagePost.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {pagePost && pagePost.category}
        </Button>
      </Link>
      <img
        src={pagePost && pagePost.image}
        alt={pagePost && pagePost.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>
          {pagePost && new Date(pagePost.createdAt).toLocaleDateString()}
        </span>
        <span className='italic'>
          {pagePost && (pagePost.content.length / 1000).toFixed(0)} mins read
          {/* the code above find the minutes read from the content length */}
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: pagePost && pagePost.content }}
      ></div>

      <CommentSection postId={pagePost && pagePost?._id} />

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  )
}
