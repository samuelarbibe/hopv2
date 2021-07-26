import React, { useMemo } from 'react'

import {
  VStack, Stack,
  Text, Accordion, AccordionItem, AccordionButton,
  AccordionPanel, RadioGroup, Radio, Box, Heading, Fade,
} from '@chakra-ui/react'

import { setShippingMethod } from '../../utils/cart'

const ShippingOptionsHeader = ({ method, intermidiateSum }) => {
  return (
    <AccordionButton height='50px' _expanded={{ bg: 'gray.100' }} justifyContent='space-between'>
      <Text fontSize='lg' fontWeight='bold'>{method.name}</Text>
      <Text fontSize='lg'>{!method.price || (method.freeAbove && intermidiateSum > method.freeAbove) ? 'חינם' : `${method.price} ₪`} </Text>
    </AccordionButton>
  )
}

const ShippingOptionsRadio = ({ method, methodOptions, selectedOptionId, onChange }) => {
  return (
    <RadioGroup onChange={onChange} value={selectedOptionId}>
      <VStack alignItems='start'>
        {
          methodOptions[method.type].map((option, index) => {
            const day = new Date(option.from).toLocaleString('he-IL', { weekday: 'long' })
            const hourFrom = new Date(option.from).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
            const hourTo = new Date(option.to).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })

            return <Radio onClick={() => { }} key={index} value={option._id}>
              {
                `${day}: ${hourFrom} - ${hourTo}`
              }
            </Radio>
          })
        }
      </VStack>
    </RadioGroup >
  )
}

const Shipping = ({ cart, products, shippingMethods }) => {
  const uniqueShippingMethods = useMemo(() => {
    const seen = {}

    return shippingMethods.filter((method) => {
      if (seen[method.type]) return false
      seen[method.type] = true
      return true
    })
  }, [shippingMethods])

  const shippingMethodsByType = useMemo(() => {
    const methods = {}

    shippingMethods.forEach((method) => {
      if (!methods[method.type]) methods[method.type] = []
      methods[method.type].push(method)
    })

    return methods
  }, [shippingMethods])

  const selectedShippingMethod = useMemo(() => {
    return shippingMethods.find((method) => method._id === cart.shippingMethod)
  }, [cart, shippingMethods])

  const cartItems = useMemo(() => {
    return cart.items.map((item) => {
      const product = products.find((product) => product._id === item.productId)
      return { ...item, ...product }
    })
  }, [cart, products])

  const intermidiateSum = cartItems.reduce((acc, curr) => {
    return acc + curr.amount * curr.price
  }, 0)

  return (
    <VStack py='5' align='stretch' dir='rtl' alignItems='stretch' justifyContent='stretch'>
      <Heading mb='2'>בחר משלוח</Heading>
      <Stack direction={{ base: 'column', md: 'row' }} spacing='8'>
        <Accordion flex='1' defaultIndex={uniqueShippingMethods.findIndex((method) => selectedShippingMethod?.type === method.type)}>
          {
            uniqueShippingMethods.map((method, index) => {
              return (
                <AccordionItem isDisabled={method.tempStock === 0 && selectedShippingMethod?._id !== method._id} key={index} id={method._id}>
                  <ShippingOptionsHeader intermidiateSum={intermidiateSum} method={method} />
                  <AccordionPanel pb={4}>
                    <Box py='2'>
                      {method.description}
                      <br />
                      {!!method.freeAbove && `חינם בקניה מעל ${method.freeAbove} ₪ `}
                    </Box>
                    <ShippingOptionsRadio
                      method={method}
                      methodOptions={shippingMethodsByType}
                      selectedOptionId={selectedShippingMethod?._id}
                      onChange={(selectedOptionId) => setShippingMethod(selectedOptionId)} />
                  </AccordionPanel>
                </AccordionItem>
              )
            })
          }
        </Accordion>
        <Box flex='1'>
          {
            selectedShippingMethod &&
            <Fade in>
              <Box p='8' w='100%' backgroundColor='gray.100' fontSize='20px'>
                {`ההזמנה ${selectedShippingMethod.type === 'pickup' ? 'תחכה לאיסוף' : 'תישלח לביתך'}`}
                <br />
                {
                  ` ב${new Date(selectedShippingMethod.from).toLocaleString('he-IL', { weekday: 'long' })}` +
                  ` ${new Date(selectedShippingMethod.from).toLocaleDateString('he-IL')}`
                }
                <br />
                {
                  ` בין השעות ${new Date(selectedShippingMethod.from).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}` +
                  ` ל- ${new Date(selectedShippingMethod.to).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} `
                }
              </Box>
            </Fade>
          }
        </Box>
      </Stack>
    </VStack >
  )
}

export default Shipping