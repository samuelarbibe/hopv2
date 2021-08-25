import React, { useMemo, useState, useEffect } from 'react'
import useSWR from 'swr'
import { Redirect, useLocation } from 'react-router-dom'

import {
  Spinner, Alert, AlertIcon, AlertTitle,
  Text, Center, Button,
  Drawer, DrawerOverlay, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerBody, Fade,
} from '@chakra-ui/react'

import { useCartTimer } from '../CartTimer'
import { useCart } from '../../hooks/useCart'
import Cart from './Cart'

const CheckoutDrawer = () => {
  const { pathname } = useLocation()
  const isInCheckoutRoute = pathname.includes('checkout')
  const [redirect, setRedirect] = useState('')

  const { isOpen, onClose } = useCart()
  const { data: cart, isError: isCartError } = useSWR('/api/cart', { refreshInterval: 5000, isPaused: () => !isOpen })
  const { data: products, isError: isProductsError } = useSWR('/api/products')
  const { data: shippingMethods, isError: isShippingMethodsError } = useSWR('/api/shippingMethods')
  const { data: cartTimer, isError: isCartTimerError } = useCartTimer()

  useEffect(() => {
    if (!isOpen) setRedirect('')
  }, [isOpen])

  const errors = useMemo(() => {
    if (isCartError || isProductsError || isCartTimerError || isShippingMethodsError) return (
      <Alert status='error' dir='rtl'>
        <AlertIcon />
        <AlertTitle>אירעה שגיאה בטעינת העגלה</AlertTitle>
      </Alert>
    )

    if (!products || !cart || !cartTimer || !shippingMethods) return (
      <Center justifySelf='center' height='md'>
        <Spinner size='lg' />
      </Center>
    )

    if (cart.items.length === 0) return (
      <Center justifySelf='center' height='md'>
        <Text fontSize='xl'>העגלה ריקה</Text>
      </Center>
    )

    return null
  }, [cart, cartTimer, isCartError, isCartTimerError, isProductsError, isShippingMethodsError, products, shippingMethods])

  if (redirect) return <Redirect to='/checkout' />

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      size='xs'
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton zIndex='999' />
        {
          errors ||
          <>
            <DrawerBody pt='50px' px='5'>
              <Alert dir='rtl' status='warning'>
                שים/י לב: העגלה תפוג עוד {cartTimer}
              </Alert>
              <Cart cart={cart} shippingMethods={shippingMethods} products={products} />
            </DrawerBody>
            <DrawerFooter>
              <Fade in={!isInCheckoutRoute}>
                <Button
                  alignSelf='end'
                  colorScheme='brand'
                  size='lg'
                  isFullWidth
                  onClick={() => setRedirect('/checkout')}
                >
                  המשך לתשלום
                </Button>
              </Fade>
            </DrawerFooter>
          </>
        }
      </DrawerContent>
    </Drawer >
  )
}

export default CheckoutDrawer