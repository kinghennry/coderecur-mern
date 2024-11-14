import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='flex min-h-96  justify-center items-center'>
      <h1>
        This Page does not exist, Go&nbsp;
        <Link to='/' className='text-underline'>
          Home
        </Link>
      </h1>
    </div>
  )
}
