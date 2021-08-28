import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Redirect } from 'react-router-dom'

import {
  Spinner, Alert, AlertIcon, AlertTitle,
  Center, Button,
  Spacer, Fade, HStack, VStack,
} from '@chakra-ui/react'

import { useCartTimer } from '../CartTimer'
import Payment from './Payment'
import Address from './Address'
import Shipping from './Shipping'
import CustomerDetails from './CustomerDetails'
import BottomNavbarHoc from '../BottomNavbarHoc'

const CheckoutStepper = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCurrentStageValid, setIsCurrentStageValid] = useState(false)

  const { data: cartTimer, isError: isCartTimerError } = useCartTimer()

  const { data: cart, isError: isCartError } = useSWR('/api/cart', { refreshInterval: 5000 })
  const { data: products, isError: isProductsError } = useSWR('/api/products', { refreshInterval: 5000 })
  const { data: shippingMethods, isError: isShippingMethodsError } = useSWR('/api/shippingMethods', { refreshInterval: 5000 })

  const isSelectedShippingDelivery = useMemo(() =>
    shippingMethods?.find((method) => method._id === cart?.shippingMethod)?.type === 'delivery'
    , [shippingMethods, cart])

  const steps = useMemo(() => [
    {
      name: 'בחירת משלוח',
      component: <Shipping cart={cart} shippingMethods={shippingMethods} products={products} />,
      allowed: () => true
    },
    ...(isSelectedShippingDelivery ? [
      {
        name: 'פרטי משלוח',
        component: <Address customerDetails={cart?.customerDetails} setIsValid={setIsCurrentStageValid} />,
        allowed: () => cart.shippingMethod
      },
    ] : []),
    {
      name: 'פרטים עליכם',
      component: <CustomerDetails customerDetails={cart?.customerDetails} setIsValid={setIsCurrentStageValid} />,
      allowed: () => isSelectedShippingDelivery ? isCurrentStageValid : cart?.shippingMethod
    },
    {
      name: 'תשלום',
      component: <Payment />,
      allowed: () => isCurrentStageValid
    },
  ], [cart, shippingMethods, products, isSelectedShippingDelivery, isCurrentStageValid])

  const handleClick = (action) => () => {
    switch (action) {
      case 'next':
        return setCurrentStep((prev) => prev + 1)
      case 'prev':
        return setCurrentStep((prev) => prev - 1)
    }
  }

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
    <Redirect to='/' />
  )

  const showNextButton = currentStep > 0 && currentStep < steps.length - 1
  const showPrevButton = steps.length > currentStep + 1

  return (
    <VStack width='100%' justifyContent='stretch' alignItems='stretch' pb='4'>
      <Alert dir='rtl' status='warning' position='sticky' top='64px' py='1' mx='-4' w='calc(100% + 8)' borderBottomWidth='1px' zIndex='999'>
        שים/י לב: העגלה תפוג עוד {cartTimer}
      </Alert>
      {
        steps[currentStep].component
      }
      <BottomNavbarHoc>
        <HStack justifyContent='stretch'>
          {
            showNextButton &&
            <Fade in={true}>
              <Button
                alignSelf='end'
                dir='rtl'
                colorScheme='brand'
                size='lg'
                variant='outline'
                onClick={handleClick('prev')}
              >
                {`חזור ל${steps[currentStep - 1].name}`}
              </Button>
            </Fade>
          }
          <Spacer />
          {
            showPrevButton &&
            <Button
              alignSelf='start'
              dir='rtl'
              colorScheme='brand'
              size='lg'
              disabled={!steps[currentStep + 1].allowed()}
              onClick={handleClick('next')}
            >
              המשך
            </Button>
          }
        </HStack>
      </BottomNavbarHoc>
    </VStack>
  )
}

export default CheckoutStepper