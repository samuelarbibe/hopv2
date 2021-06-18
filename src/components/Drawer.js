import React, { useMemo, useState } from 'react'
import useSWR from 'swr'

import {
  Spinner, Alert, AlertIcon, AlertTitle,
  Text, Center, Button,
  Drawer, DrawerOverlay, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerBody, Spacer
} from '@chakra-ui/react'

import { useCartTimer } from './CartTimer'
import { useCart } from '../hooks/useCart'
import Cart from './Cart'
import Shipping from './Shipping'

const CheckoutDrawer = () => {
  const { isOpen, onClose } = useCart()
  const [stage, setStage] = useState(0)

  const { data: cart, isError: isCartError } = useSWR('/api/cart', { refreshInterval: 5000, isPaused: () => !isOpen })
  const { data: products, isError: isProductsError } = useSWR('/api/products')
  const { data: shippingMethods, isError: isShippingMethodsError } = useSWR('/api/shippingMethods')
  const { data: cartTimer, isError: isCartTimerError } = useCartTimer()

  const errors = useMemo(() => {
    if (isCartError || isProductsError || isCartTimerError || isShippingMethodsError) return (
      <Alert status='error' dir='rtl'>
        <AlertIcon />
        <AlertTitle>אירעה שגיאה בטעינת העגלה</AlertTitle>
      </Alert>
    )

    if (!products || !cart || !cartTimer || !shippingMethods) return (
      <Center justifySelf='center' height='100%'>
        <Spinner size='lg' />
      </Center>
    )

    if (cart.items.length === 0) return (
      <Center justifySelf='center' height='100%'>
        <Text fontSize='xl'>העגלה ריקה</Text>
      </Center>
    )

    return null
  }, [cart, cartTimer, isCartError, isCartTimerError, isProductsError, products])

  const stages = useMemo(() => {
    if (errors) return []
    return [
      {
        name: 'עגלה',
        component: <Cart cart={cart} shippingMethods={shippingMethods} products={products} />
      },
      {
        name: 'בחירת משלוח',
        component: <Shipping cart={cart} shippingMethods={shippingMethods} />
      },
    ]
  }, [errors, cart, shippingMethods, products])

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      size='sm'
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        {
          errors ||
          <>
            <DrawerBody pt='50px'>
              <Alert dir='rtl' status='warning'>
                שים לב: העגלה תפוג עוד {cartTimer}
              </Alert>
              {
                stages[stage].component
              }
            </DrawerBody>
            <DrawerFooter justifyContent='stretch'>
              {
                stage > 0 &&
                <Button
                  alignSelf='end'
                  dir='rtl'
                  colorScheme='pink'
                  size='lg'
                  onClick={() => setStage((prev) => prev - 1)}
                >
                  {`חזור ל${stages[stage - 1].name}`}
                </Button>
              }
              <Spacer />
              {
                stages.length > stage + 1 &&
                <Button
                  alignSelf='start'
                  dir='rtl'
                  colorScheme='pink'
                  size='lg'
                  onClick={() => setStage((prev) => prev + 1)}
                >
                  {`המשך ל${stages[stage + 1].name}`}
                </Button>
              }
            </DrawerFooter>
          </>
        }
      </DrawerContent>
    </Drawer >
  )
}

export default CheckoutDrawer