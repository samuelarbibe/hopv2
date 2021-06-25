import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { Carousel } from 'react-responsive-carousel'
import { GoPrimitiveDot } from 'react-icons/go'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const Indicator = ({ isSelected, onClick }) => {
  return (
    <Box
      mb='4'
      onClick={onClick}
      display='inline-block'
      color={isSelected ? 'gray.100' : 'gray.600'}
    >
      <GoPrimitiveDot />
    </Box>
  )
}

const ProductImages = ({ imageUrls, ...args }) => {
  const [currIndex, setCurrIndex] = useState(0)

  if (!imageUrls.length) return null

  return (
    <Carousel
      showArrows={false}
      showStatus={false}
      showThumbs={false}
      selectedItem={currIndex}
      onChange={(newIndex) => setCurrIndex(newIndex)}
      renderIndicator={(_, isSelected, index) =>
        <Indicator isSelected={isSelected} onClick={() => setCurrIndex(index)} />
      }
      emulateTouch
      infiniteLoop
      {...args}
    >
      {
        imageUrls.map((imageUrl, index) => {
          return (
            <div key={index}>
              <img src={imageUrl} alt={`product-${index}`} />
            </div>
          )
        })
      }
    </Carousel>
  )
}

export default ProductImages