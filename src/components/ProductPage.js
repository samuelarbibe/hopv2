import React, { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import { useParams } from 'react-router'
import { useTrail, animated } from 'react-spring'

import {
  Spinner, Alert, HStack, Tag,
  AlertIcon, AlertTitle, Button, ButtonGroup, IconButton,
  Center, Flex, Heading, Text, VStack, Stack, Box, Spacer, useToast
} from '@chakra-ui/react'
import { MinusIcon, AddIcon } from '@chakra-ui/icons'

import { updateCart } from '../utils/cart'
import { useCart } from '../hooks/useCart'
import { useConsts } from '../hooks/useConsts'

import ProductImages from './ProductImages'
import BottomNavbarHoc from './BottomNavbarHoc'

const ProductPage = () => {
  const toast = useToast()
  const { id } = useParams()
  const { consts } = useConsts()
  const { onOpen: openCart } = useCart()

  const [tempAmount, setTempAmount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const { data: cart, isErrorCart } = useSWR('/api/cart', { refreshInterval: 5000 })
  const { data: product, isErrorProduct } = useSWR(`/api/products/${id}`, { refreshInterval: 5000 })

  const open = !!product
  const trail = useTrail(3, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    from: { opacity: 0, x: 20 },
  })

  const amountInCart = useMemo(() => cart?.items.find((item) => item.productId === id)?.amount || 0, [cart, id])
  const amountDiff = useMemo(() => tempAmount - amountInCart, [tempAmount, amountInCart])

  useEffect(() => {
    setTempAmount(amountInCart || 1)
  }, [cart, id, product, amountInCart])

  if (isErrorProduct || isErrorCart) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load product</AlertTitle>
    </Alert>
  )

  if (!product || !cart) return (
    <Center justifySelf='center' height='md'>
      <Spinner size='lg' />
    </Center>
  )

  const handleClickAmount = (actionType) => async () => {
    switch (actionType) {
      case 'add':
        return setTempAmount((prev) => prev + 1)
      case 'sub':
        return setTempAmount((prev) => prev - 1)
    }
  }

  const handleClickSave = async () => {
    setIsLoading(true)

    const success = await updateCart(id, amountDiff)
    if (success) {
      openCart()
    } else {
      toast({
        title: 'אירעה שגיאה בעדכון העגלה',
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }

    setIsLoading(false)
  }

  return (
    <VStack py='5' pb='4' alignItems='stretch'>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: '0', md: '8' }}>
        <Box flex={1} overflowX='hidden' mx='-4'>
          <ProductImages imageUrls={product.images} />
        </Box>
        <Flex direction='column' flex={1}>
          <VStack align='stretch'>
            <animated.div style={trail[0]}>
              <Heading size='lg'>{product.name}</Heading>
            </animated.div>
            <animated.div style={trail[1]}>
              <Text dir='rtl' color='gray.600'>{product.description}</Text>
            </animated.div>
          </VStack>
          <Spacer py='3' />
          <VStack align='stretch' spacing='5'>
            <animated.div style={trail[2]}>
              <HStack w='100%'>
                {
                  !product.tempStock
                    ? <Tag size='sm' colorScheme='red'>אין במלאי</Tag>
                    : (
                      <ButtonGroup isAttached>
                        <IconButton
                          backgroundColor='gray.50'
                          _disabled={{ color: 'gray.300', opacity: 1 }}
                          disabled={isLoading || amountDiff >= product.tempStock || tempAmount === +consts('max_product_amount')}
                          icon={<AddIcon height='13px' />}
                          onClick={handleClickAmount('add')} />
                        <Box width='10' backgroundColor='gray.50' display='flex' alignItems='center' justifyContent='center'>
                          <Text textAlign='center' fontSize='lg' fontWeight='bold' >{tempAmount}</Text>
                        </Box>
                        <IconButton
                          backgroundColor='gray.50'
                          _disabled={{ color: 'gray.300', opacity: 1 }}
                          disabled={isLoading || tempAmount === 0}
                          icon={<MinusIcon height='12px' />}
                          onClick={handleClickAmount('sub')} />
                      </ButtonGroup>
                    )
                }
                <Spacer />
                <Text size='large' fontSize='lg' fontWeight='bold'>{product.price * tempAmount || product.price} ₪</Text>
              </HStack>
            </animated.div>
            <BottomNavbarHoc>
              <Button
                dir='rtl'
                isLoading={isLoading}
                loadingText='מעדכן...'
                disabled={(tempAmount === 0 && amountInCart === 0) || tempAmount === amountInCart}
                colorScheme='brand'
                size='lg'
                height='60px'
                isFullWidth
                onClick={handleClickSave}
              >
                {amountInCart ? 'עדכן עגלה' : 'הוסף לעגלה'}
              </Button>
            </BottomNavbarHoc>
          </VStack>
        </Flex>
      </Stack >
    </VStack>
  )
}

export default ProductPage