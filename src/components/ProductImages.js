import { Box, HStack, Image } from "@chakra-ui/react"
import { useState } from "react"

const ProductImages = ({ imageUrls }) => {

  const [mainImageIndex, setMainImageIndex] = useState(0)

  if (!imageUrls.length) return null

  return (
    <Box>
      {
        imageUrls.map((imageUrl, index) => {
          return <Image
            key={index}
            hidden={index !== mainImageIndex}
            maxHeight='400px'
            width='100%'
            src={imageUrl}
            fit='cover' />
        })
      }
      {
        imageUrls.length > 1 &&
        <HStack align='stretch' justify='space-evenly' spacing='2' mt='1'>
          {
            imageUrls.map((imageUrl, index) => {
              return (
                <Box key={index} onClick={() => setMainImageIndex(index)}>
                  <Image maxHeight='150px' src={imageUrl} fit='cover' />
                </Box>
              )
            })
          }
        </HStack>
      }
    </Box>
  )
}

export default ProductImages