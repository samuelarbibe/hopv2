import { Box, Fade, HStack, Image } from "@chakra-ui/react"
import { useState } from "react"

const ProductImages = ({ imageUrls }) => {
  const [mainImageIndex, setMainImageIndex] = useState(0)

  if (!imageUrls.length) return null

  return (
    <Fade in>
      {
        imageUrls.map((imageUrl, index) => {
          return (
            <Box
              key={index}
              height={{ base: '400px', md: '500px' }}
              width='100%'
              overflow='hidden'
              hidden={index !== mainImageIndex}
            >
              <Image
                src={imageUrl}
                fit='cover'
              />
            </Box>
          )
        })
      }
      {
        imageUrls.length > 1 &&
        <HStack align='stretch' justify='space-evenly' spacing='2' mt='1'>
          {
            imageUrls.map((imageUrl, index) => {
              return (
                <Box key={index} maxHeight='200px' overflow='hidden' onClick={() => setMainImageIndex(index)}>
                  <Image src={imageUrl} fit='cover' />
                </Box>
              )
            })
          }
        </HStack>
      }
    </Fade>
  )
}

export default ProductImages