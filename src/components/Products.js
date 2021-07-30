import React from 'react'
import useSWR from 'swr'
import { useHistory } from 'react-router'
import { useTrail, animated } from 'react-spring'

import {
  Alert, AlertIcon, AlertTitle, Image, Box,
  Center, Flex, Heading, SimpleGrid, Text, Spinner,
  Spacer, HStack, Tag,
} from '@chakra-ui/react'

const Products = () => {
  const history = useHistory()
  const { data: products, isError } = useSWR('/api/products')

  const open = !!products
  const trail = useTrail(products?.length || 0, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    from: { opacity: 0, x: 20 },
  })

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load products</AlertTitle>
    </Alert>
  )

  if (!products) return (
    <Center justifySelf='center' height='md'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing='10' py='5' pb='10'>
      {
        products
          .sort((product) => product.tempStock)
          .map((product, index) => {
            return (
              <animated.div key={index} style={trail[index]}>
                <Box onClick={() => history.push(`/product/${product._id}`)} >
                  <Box height='400px'>
                    <Image alt={product.name} height='100%' width='100%' src={product.images[0]} fit='cover' />
                  </Box>
                  <Flex height='110px' direction='column' mt='7'>
                    <Heading mb='2' size='md'>{product.name}</Heading>
                    <Text dir='rtl' color='gray.600'>{product.description}</Text>
                    <Spacer />
                    <HStack w='100%'>
                      <Text size='large' fontSize='lg'>{product.price} ₪</Text>
                      <Spacer />
                      {
                        !product.tempStock &&
                        <Tag size='sm' colorScheme='red'>אין במלאי</Tag>
                      }
                    </HStack>
                  </Flex>
                </Box>
              </animated.div>
            )
          })
      }
    </SimpleGrid >
  )
}

export default Products