import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets'
import LazyImage from '../LazyImage'
import { COMPANY, COMPANY_STATS } from '../../utils/siteConfig'
import { useAnimatedStats } from '../../utils/useAnimatedStats'

const About = () => {
  const animatedStats = useAnimatedStats(COMPANY_STATS)


  return (
    <div className='w-full overflow-hidden'>
      <div className='flex flex-col items-center container mx-auto p-14 md:px-20 lg:px-32 w-full bg-white text-black' id='About'>
        <h1 className='text-2xl sm:text-4xl font-bold mb-2'>About <span className='underline underline-offset-4 decoration-1 font-light'>{COMPANY.shortName}</span></h1>
        <p className='text-gray-500 max-w-80 text-center mb-8'>Passionate about connecting investors and families with premium properties, delivering exceptional real estate solutions that exceed expectations and create lasting value.</p>
        <div className='flex flex-col md:flex-row items-center md:items-start md:gap-20 w-full'>
          <LazyImage
            src={assets.brand_img}
            alt={`${COMPANY.shortName} brand`}
            skeletonClass='w-full sm:w-1/2 max-w-lg rounded-lg shadow-xl'
            className='block w-full h-auto'
            sizes='(max-width: 768px) 100vw, 50vw'
          />

          <div className='flex flex-col items-center md:items-start mt-10 text-gray-700 w-full'>
            <div className='grid grid-cols-2 gap-6 md:gap-10 w-full 2xl:pr-28'>
              {COMPANY_STATS.map((stat) => (
                <div key={stat.key}>
                  <p className='text-4xl font-bold text-brand'>{animatedStats[stat.key] > 0 ? animatedStats[stat.key] : 0}+</p>
                  <p className='text-sm font-medium'>{stat.label}</p>
                </div>
              ))}
            </div>
            <p className='mt-8 max-w-xl text-gray-600'>Our core purpose is to restore balance and reliability to the industry by operating with uncompromising integrity and transparency. At Citify, we firmly believe in a client-first philosophy, prioritizing your peace of mind and long-term success over short-term profit maximization.</p>
            <Link to='/properties' className='mt-8 inline-block bg-brand text-white px-8 py-2.5 rounded-full hover:bg-brand-strong transition-colors font-medium text-sm'>View Our Properties</Link>
          </div>
        </div>
      </div>

    </div>
  )
}

export default About