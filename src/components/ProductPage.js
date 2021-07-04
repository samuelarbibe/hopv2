import React, { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'

import { useParams } from 'react-router'
import { updateCart } from '../utils/cart'

import {
  Spinner, Alert, HStack, Tag,
  AlertIcon, AlertTitle, Button, ButtonGroup, IconButton,
  Center, Flex, Heading, Text, VStack, Stack, Box, SlideFade, Spacer
} from '@chakra-ui/react'
import { MinusIcon, AddIcon } from '@chakra-ui/icons'
import ProductImages from './ProductImages'

const ProductPage = () => {
  const { id } = useParams()
  const { data: loadedProducts } = useSWR('/api/products', {
    revalidateOnMount: false,
    revalidateOnFocus: false,
  })
  const { data: product, isErrorProduct } = useSWR(`/api/products/${id}`, {
    initialData: loadedProducts?.find((product) => product._id === id),
    revalidateOnMount: true,
    refreshInterval: 5000,
  })
  const { data: cart, isErrorCart } = useSWR('/api/cart')

  const amountInCart = cart?.items.find((item) => item.productId === id)?.amount || 0
  const [tempAmount, setTempAmount] = useState(() => amountInCart)
  const [isLoading, setIsLoading] = useState(false)
  const amountDiff = useMemo(() => tempAmount - amountInCart, [tempAmount, amountInCart])

  useEffect(() => {
    setTempAmount(amountInCart)
  }, [cart, id, product, amountInCart])

  if (isErrorProduct || isErrorCart) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load product</AlertTitle>
    </Alert>
  )

  if (!product || !cart) return (
    <Center justifySelf='center' height='100%'>
      <Spinner size='lg' />
    </Center>
  )

  const handleClick = async (actionType) => {
    switch (actionType) {
      case 'add':
        setTempAmount((prev) => prev + 1)
        break
      case 'sub':
        setTempAmount((prev) => prev - 1)
        break
      case 'save':
        setIsLoading(true)
        await updateCart(id, amountDiff)
        setIsLoading(false)
        break
      default:
        break
    }
  }

  return (
    <VStack py='5' pb='10'>
      <Stack direction={{ base: 'column', md: 'row' }} spacing='8'>
        <Box flex={1}>
          <ProductImages imageUrls={product.images} />
        </Box>
        <Flex direction='column' flex={1}>
          <VStack align='stretch'>
            <Heading size='lg'>{product.name}</Heading>
            <Text dir='rtl' color='gray.600'>{product.description}</Text>
            <HStack w='100%'>
              <Text size='large' fontSize='lg' fontWeight='bold'>{product.price} ₪</Text>
              <Spacer />
              {
                !product.tempStock &&
                <Tag size='sm' colorScheme='red'>אין במלאי</Tag>
              }
            </HStack>
          </VStack>
          <Spacer py='3' />
          <VStack align='stretch' spacing='3'>
            <Flex direction='row-reverse' justifyContent='space-between'>
              <Text dir='rtl' alignSelf='center' fontSize='xl' fontWeight='bold' >כמות: </Text>
              <ButtonGroup >
                <IconButton disabled={isLoading || amountDiff >= product.tempStock} icon={<AddIcon />} size='lg' onClick={() => handleClick('add')} />
                <Text width='8' textAlign='center' alignSelf='center' fontSize='xl' fontWeight='bold' >{tempAmount}</Text>
                <IconButton disabled={isLoading || tempAmount === 0} icon={<MinusIcon />} size='lg' onClick={() => handleClick('sub')} />
              </ButtonGroup>
            </Flex>
            <SlideFade in={true}>
              <Button
                dir='rtl'
                isLoading={isLoading}
                loadingText='מעדכן...'
                disabled={(tempAmount === 0 && amountInCart === 0) || tempAmount === amountInCart}
                colorScheme='brand'
                size='lg'
                isFullWidth
                onClick={() => handleClick('save')}
              >
                {amountInCart ? 'עדכן עגלה' : 'הוסף לעגלה'}
              </Button>
            </SlideFade>
          </VStack>
        </Flex>
      </Stack >
    </VStack>
  )
}

export default ProductPage