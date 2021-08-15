import React from 'react'

import { Text } from '@chakra-ui/react'
import { Center, Heading } from '@chakra-ui/layout'

const ThankYou = () => {
  return (
    <Center dir='rtl' mt='36' borderRadius='md' bg='green.300' p='8' color='white' flexDir='column'>
      <Heading>תודה על הקנייה!</Heading>
      <Text color='white' mt='3'>פרטי ההזמנה נשלחו למייל שלכם</Text>
    </Center>
  )
}

export default ThankYou