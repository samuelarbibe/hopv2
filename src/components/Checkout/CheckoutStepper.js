import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Redirect } from 'react-router-dom'

import {
  Spinner, Alert, AlertIcon, AlertTitle,
  Center, Button,
  Spacer, Fade, HStack, VStack,
} from '@chakra-ui/react'

import { useCartTimer } from '../CartTimer'
import Address from './Address'
import Shipping from './Shipping'

const CheckoutStepper = () => {
  const [stage, setStage] = useState(0)
  const [isCurrentStageValid, setIsCurrentStageValid] = useState(false)

  const { data: cart, isError: isCartError } = useSWR('/api/cart', { refreshInterval: 5000 })
  const { data: products, isError: isProductsError } = useSWR('/api/products')
  const { data: shippingMethods, isError: isShippingMethodsError } = useSWR('/api/shippingMethods', { refreshInterval: 5000 })
  const { data: cartTimer, isError: isCartTimerError } = useCartTimer()

  const isSelectedShippingDelivery = useMemo(() => shippingMethods?.find((method) => method._id === cart?.shippingMethod)?.type === 'delivery', [shippingMethods, cart])

  const stages = useMemo(() => {
    return [
      {
        name: 'בחירת משלוח',
        component: <Shipping cart={cart} shippingMethods={shippingMethods} products={products} />,
        allowed: () => true
      },
      ...(isSelectedShippingDelivery ? [
        {
          name: 'פרטי משלוח',
          component: <Address customerDetails={cart.customerDetails} setIsValid={setIsCurrentStageValid} />,
          allowed: () => cart.shippingMethod
        },
      ] : []),
      {
        name: 'תשלום',
        component: <Spacer />,
        allowed: () => {
          return isSelectedShippingDelivery
            ? isCurrentStageValid
            : cart.shippingMethod
        }
      },
    ]
  }, [cart, shippingMethods, products, isSelectedShippingDelivery, isCurrentStageValid])

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
    <Redirect to='/' />
  )

  return (
    <VStack width='100%' justifyContent='stretch' alignItems='stretch' pb='5'>
      <Alert dir='rtl' status='warning'>
        שים/י לב: העגלה תפוג עוד {cartTimer}
      </Alert>
      {
        stages[stage].component
      }
      <HStack justifyContent='stretch'>
        {
          stage > 0 &&
          <Fade in={true}>
            <Button
              borderRadius='xl'
              alignSelf='end'
              dir='rtl'
              colorScheme='brand'
              size='lg'
              variant='outline'
              onClick={() => setStage((prev) => prev - 1)}
            >
              {`חזור ל${stages[stage - 1].name}`}
            </Button>
          </Fade>
        }
        <Spacer />
        {
          stages.length > stage + 1 &&
          <Button
            borderRadius='xl'
            alignSelf='start'
            dir='rtl'
            colorScheme='brand'
            size='lg'
            disabled={!stages[stage + 1].allowed()}
            onClick={() => setStage((prev) => prev + 1)}
          >
            המשך
          </Button>
        }
      </HStack>
    </VStack>
  )
}

export default CheckoutStepper