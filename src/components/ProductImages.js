import React, { useMemo, useState } from 'react'

import { Box, useMediaQuery } from '@chakra-ui/react'
import { Carousel } from 'react-responsive-carousel'
import ZoomSlider from 'react-instagram-zoom-slider'
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
  const [isLowerThenMd] = useMediaQuery('(max-width: 48em)')

  const images = useMemo(() => imageUrls.map((imageUrl, index) => {
    return (
      <img draggable='false' key={index} src={imageUrl} alt={`product-${index}`} />
    )
  }), [imageUrls])

  return (
    isLowerThenMd
      ? (
        <ZoomSlider slides={images} />
      )
      : (
        <Carousel
          showArrows={false}
          showStatus={false}
          showThumbs={false}
          selectedItem={currIndex}
          onChange={(newIndex) => setCurrIndex(newIndex)}
          renderIndicator={
            (_, isSelected, index) =>
              <Indicator isSelected={isSelected} onClick={() => setCurrIndex(index)} />
          }
          emulateTouch
          infiniteLoop
          {...args}
        >
          {images}
        </Carousel >
      )
  )
}

export default ProductImages