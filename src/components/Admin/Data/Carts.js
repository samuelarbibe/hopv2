import React from 'react'
import useSWR from 'swr'

import {
  Heading, VStack, StatGroup, StatLabel,
  Alert, AlertIcon, AlertTitle, StatNumber,
  Center, Spinner, Stat,
} from '@chakra-ui/react'

const Carts = () => {
  const { data: carts, isError } = useSWR('/api/cart/all', { refreshInterval: 5000 })

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load carts</AlertTitle>
    </Alert>
  )

  if (!carts) return (
    <Center justifySelf='center' height='100%'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <VStack pt='10' spacing='5' dir='rtl' align='stretch'>
      <Heading size='md' >עגלות</Heading>
      <StatGroup border="1px" borderColor="gray.200" rounded='lg' p='5'>
        <Stat>
          <StatLabel>פעילות</StatLabel>
          <StatNumber>{carts.length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>ריקות</StatLabel>
          <StatNumber>{carts.filter((cart) => !cart.items.length).length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>עגלה</StatLabel>
          <StatNumber>{carts.filter((cart) => cart.items.length && !cart.shippingMethod).length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>משלוח</StatLabel>
          <StatNumber>{carts.filter((cart) => cart.items.length && cart.shippingMethod).length}</StatNumber>
        </Stat>
      </StatGroup>
    </VStack>
  )
}

export default Carts