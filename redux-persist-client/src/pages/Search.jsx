import { Button, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { getSearchResults } from '../redux/search-slice'
import PostCard from '../components/PostCard'

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  })

  const location = useLocation()
  const navigate = useNavigate()
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch)
  const dispatch = useDispatch()

  //* run a useffect for search term
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    //* get searchTerm
    const searchTermFromUrl = urlParams.get('searchTerm')
    //* get category
    const categoryFromUrl = urlParams.get('category')
    //* get sort
    const sortFromUrl = urlParams.get('sort')
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        category: categoryFromUrl,
        sort: sortFromUrl,
      })
    }
    // const searchQuery = urlParams.toString().toLowerCase().trim()
    const searchQuery = urlParams.toString()
    // console.log(urlParams, 'urlParams')
    dispatch(getSearchResults(searchQuery))
  }, [location.search])

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value })
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc'
      setSidebarData({ ...sidebarData, sort: order })
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized'
      setSidebarData({ ...sidebarData, category })
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('category', sidebarData.category)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  console.log(searchResults, 'searchResults')
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex   items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Posts results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!isLoading && searchResults.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {isLoading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!isLoading &&
            searchResults &&
            searchResults.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
        </div>
      </div>
    </div>
  )
}
