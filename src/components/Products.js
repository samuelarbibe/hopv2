import React from 'react'
import useSWR from 'swr'
import { useHistory } from 'react-router'

import {
  Alert, AlertIcon, AlertTitle, Image, Box,
  Center, Flex, Heading, SimpleGrid, Text, Spinner, Fade
} from '@chakra-ui/react'

const Products = () => {
  const history = useHistory()
  const { data: products, isError } = useSWR('/api/products')

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load products</AlertTitle>
    </Alert>
  )

  if (!products) return (
    <Center justifySelf='center' height='100%'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing='10' py='5'>
      {
        products
          .sort((product) => product.tempStock)
          .map((product, index) => {
            return (
              <Fade in key={index}>
                <Box onClick={() => history.push(`/product/${product._id}`)} >
                  <Box height='400px'>
                    <Image height='100%' width='100%' src={product.images[0]} fit='cover' />
                  </Box>
                  <Flex height='110px' direction='column' mt='7'>
                    <Heading color='gray.700' mb='2' size='md'>{product.name}</Heading>
                    <Text dir='rtl' color='gray.600'>{product.description}</Text>
                    <Box flex='1' />
                    <Text color='gray.700' size='large' fontSize='lg'>{product.price} ₪</Text>
                  </Flex>
                </Box>
              </Fade>
            )
          })
      }
    </SimpleGrid >
  )
}

export default Products