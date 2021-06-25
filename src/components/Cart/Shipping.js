import React, { useMemo } from 'react'

import {
  VStack,
  Text, Accordion, AccordionItem, AccordionButton,
  AccordionPanel,
  RadioGroup,
  Radio,
  Box,
  Heading,
} from '@chakra-ui/react'

import { setShippingMethod } from '../../utils/cart'

const ShippingOptionsHeader = ({ method }) => {
  return (
    <AccordionButton height='50px' _expanded={{ bg: 'gray.100' }} justifyContent='space-between'>
      <Text color='gray.700' fontSize='lg' fontWeight='bold'>{method.name}</Text>
      <Text color='gray.700' fontSize='lg'>{method.price ? `${method.price} ₪` : 'חינם'} </Text>
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

const Shipping = ({ cart, shippingMethods }) => {
  const uniqueShippingMethods = useMemo(() => {
    const seen = {}

    return shippingMethods.filter((method) => {
      if (seen[method._id]) return false
      seen[method._id] = true
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

  return (
    <VStack py='5' align='stretch' dir='rtl'>
      <Heading mb='2'>בחר משלוח</Heading>
      <Accordion defaultIndex={uniqueShippingMethods.findIndex((method) => selectedShippingMethod?.type === method.type)}>
        {
          uniqueShippingMethods.map((method, index) => {
            return (
              <AccordionItem isDisabled={method.tempStock === 0 && selectedShippingMethod?._id !== method._id} key={index} id={method._id}>
                <ShippingOptionsHeader method={method} />
                <AccordionPanel pb={4}>
                  <Box py='2'>
                    {method.description}
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
      {
        selectedShippingMethod &&
        <Box p='8' backgroundColor='gray.100' fontSize='20px' >
          {
            `ההזמנה ${selectedShippingMethod.type === 'pickup' ? 'תחכה לאיסוף' : 'תישלח לביתך'}` +
            ` ב${new Date(selectedShippingMethod.from).toLocaleString('he-IL', { weekday: 'long' })}` +
            ` ${new Date(selectedShippingMethod.from).toLocaleDateString('he-IL')}` +
            ` בין השעות ${new Date(selectedShippingMethod.from).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}` +
            ` ל- ${new Date(selectedShippingMethod.to).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })} `
          }
        </Box>
      }
    </VStack >
  )
}

export default Shipping