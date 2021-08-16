import React from 'react'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'

import { Text } from '@chakra-ui/react'
import { Center, Heading } from '@chakra-ui/layout'

const ThankYou = () => {
  const { search } = useLocation()
  const { cField1: orderId, response } = queryString.parse(search)

  return (
    response === 'success'
      ? (
        <Center dir='rtl' mt='36' borderRadius='md' bg='green.300' p='8' color='white' flexDir='column'>
          <Heading>תודה על הקנייה!</Heading>
          <Text color='white' mt='3'>{orderId && `מספר הזמנה: ${orderId}`}</Text>
          <Text color='white' mt='3'>פרטי ההזמנה נשלחו למייל שלכם</Text>
        </Center>
      ) : (
        <Center dir='rtl' mt='36' borderRadius='md' bg='red.400' p='8' color='white' flexDir='column'>
          <Heading>הייתה בעיה ביצירת ההזמנה</Heading>
          <Text color='white' mt='3'>{orderId && `מספר הזמנה: ${orderId}`}</Text>
          <Text color='white' mt='3'>יש ליצור קשר עימנו ולציין את מספר ההזמנה</Text>
        </Center>
      )
  )
}

export default ThankYou