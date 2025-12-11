import { useEffect, useState } from 'react'
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaArrowLeft,
  FaArrowRight,
  FaCircle,
} from 'react-icons/fa'

const Carousel = ({ url, limit }: { url: string; limit: number }) => {
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async (url: string) => {
      try {
        setLoading(true)
        const response = await fetch(`${url}?limit=${limit} `)
        const data = await response.json()
        if (data) {
          // const imageUrls = data.map((item: { url: string }) => item.url)
          setImages(data)
        }
        setLoading(false)
        setError(null)
      } catch (error) {
        setError('Failed to fetch images: ' + (error as Error).message)
        setLoading(false)
      }
    }
    fetchImages(url)
  }, [url, limit])

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error}</div>
  }

  // console.log(images)
  function handleDots(index: number): void {
    setCurrentIndex(index)
  }

  function handleView(direction: 'next' | 'prev'): void {
    setCurrentIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % images.length
      } else {
        return (prevIndex - 1 + images.length) % images.length
      }
    })
  }

  return (
    <div className='container mt-5 relative mx-auto flex  items-center justify-center overflow-hidden'>
      <FaArrowAltCircleLeft
        size={30}
        className='absolute z-10 left-4 text-gray-200'
        onClick={() => handleView('prev')}
      />
      {images.length > 0 ? (
        images.map((image, index) => (
          <img
            key={index}
            src={image.download_url}
            alt={`Slide ${index + 1}`}
            className={`${index === currentIndex ? 'block' : 'hidden'} h-[500px] w-full`}
          />
        ))
      ) : (
        <div>No images to display</div>
      )}
      {/* indicators */}
      <div className='flex w-[200px] justify-between items-center absolute bottom-4'>
        {images.length > 0 &&
          images.map((_, index) => (
            <FaCircle
              key={index}
              size={10}
              className={`${
                index === currentIndex ? 'text-gray-800' : 'text-gray-400'
              } cursor-pointer`}
              onClick={() => handleDots(index)}
            />
          ))}
      </div>
      <FaArrowAltCircleRight
        size={30}
        className='absolute z-10 right-4 text-gray-200'
        onClick={() => handleView('next')}
      />
    </div>
  )
}

export default Carousel
