import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,#d4f1e4,#eaf8f2_45%,#ffffff_85%)] px-6 py-20'>
      <div className='mx-auto flex max-w-3xl flex-col items-center justify-center rounded-3xl border border-[#058F44]/15 bg-white/90 px-8 py-14 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#058F44]'>404</p>
        <h1 className='mt-4 text-4xl font-bold text-slate-900 sm:text-5xl'>Page Not Found</h1>
        <p className='mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg'>
          The page you are trying to reach does not exist or may have been moved.
        </p>
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Link
            to='/'
            className='inline-flex items-center justify-center rounded-xl bg-[#058F44] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#047335]'
          >
            Back to Home
          </Link>
          <Link
            to='/properties'
            className='inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
