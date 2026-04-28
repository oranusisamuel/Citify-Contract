import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets'

const navItems = [
  { to: '/admin/properties', label: 'Properties' },
  { to: '/admin/blog', label: 'Blog' },
  { to: '/admin/tours', label: 'Inspections' },
  { to: '/admin/contacts', label: 'Contacts' },
]

const classNames = (...classes) => classes.filter(Boolean).join(' ')

const AdminHeader = ({ onLogout }) => {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const isActiveRoute = (to) => location.pathname === to

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-slate-900 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-0 md:h-16 flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-brand flex items-center justify-center font-bold text-white text-sm select-none'>C</div>
          <span className='font-semibold text-white text-lg tracking-tight'>Citify Admin</span>
        </div>

        <div className='flex items-center gap-2'>
          <nav className='hidden md:flex items-center gap-1'>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={classNames(
                  'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  isActiveRoute(item.to)
                    ? 'bg-brand text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              type='button'
              onClick={onLogout}
              className='ml-2 px-3 py-2 rounded-lg border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-colors whitespace-nowrap'
            >
              Log Out
            </button>
          </nav>

          <button
            type='button'
            onClick={() => setMenuOpen(true)}
            className='md:hidden inline-flex items-center justify-center rounded-lg border border-slate-600 p-2 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors'
            aria-label='Open navigation menu'
            aria-expanded={menuOpen}
          >
            <img src={assets.menu_icon} className='w-5 h-5' alt='Open menu' />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className='fixed inset-0 z-60'>
          <button
            type='button'
            className='absolute inset-0 bg-slate-950/50'
            onClick={closeMenu}
            aria-label='Close menu overlay'
          />

          <div className='absolute right-0 top-0 h-full w-full max-w-xs bg-slate-950 text-white shadow-2xl p-4'>
            <div className='flex items-center justify-between mb-6'>
              <p className='text-sm tracking-[0.22em] uppercase text-slate-300'>Menu</p>
              <button
                type='button'
                onClick={closeMenu}
                className='rounded-lg p-2 text-slate-200 hover:bg-slate-800'
                aria-label='Close navigation menu'
              >
                <img src={assets.cross_icon} className='w-5 h-5' alt='Close menu' />
              </button>
            </div>

            <div className='space-y-2'>
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={classNames(
                    'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActiveRoute(item.to)
                      ? 'bg-brand text-white'
                      : 'text-slate-200 hover:bg-slate-800'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <button
              type='button'
              onClick={() => {
                closeMenu()
                onLogout()
              }}
              className='mt-6 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors'
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default AdminHeader
