import { useEffect, useState } from 'react'
import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaCircle } from 'react-icons/fa'

// Carousel component displays a collection of images with navigation controls
const Carousel = ({ url, limit }: { url: string; limit: number }) => {
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch images from API on component mount or when dependencies change
  useEffect(() => {
    const fetchImages = async (url: string) => {
      try {
        setLoading(true)
        const response = await fetch(`${url}?limit=${limit} `)
        const data = await response.json()
        if (data) {
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

  // Update current index when dot indicator is clicked
  function handleDots(index: number): void {
    setCurrentIndex(index)
  }

  // Navigate carousel forward or backward
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
      {/* Previous button */}
      <FaArrowAltCircleLeft
        size={30}
        className='absolute z-10 left-4 text-gray-200'
        onClick={() => handleView('prev')}
      />
      {/* Image display */}
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
      {/* Dot indicators for image navigation */}
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
      {/* Next button */}
      <FaArrowAltCircleRight
        size={30}
        className='absolute z-10 right-4 text-gray-200'
        onClick={() => handleView('next')}
      />
    </div>
  )
}

export default Carousel
