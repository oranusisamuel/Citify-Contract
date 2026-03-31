import React, { useState } from 'react'

const LazyImage = ({ src, alt, className = '', skeletonClass = '', loading = 'lazy', sizes }) => {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className={`relative overflow-hidden ${skeletonClass}`}>
      {!loaded && !errored && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse' />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding='async'
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setErrored(true) }}
        className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  )
}

export default LazyImage
