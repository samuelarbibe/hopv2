import React from 'react'
import useSWR from 'swr'

import {
  Heading, VStack, HStack,
  Alert, AlertIcon, AlertTitle,
  Center, Spinner, Box,
} from '@chakra-ui/react'
import OrdersTable from './Data/OrdersTable'


const Orders = () => {
  const { data: orders, isError } = useSWR('/api/orders/all', { refreshInterval: 5000 })

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load orders</AlertTitle>
    </Alert>
  )

  if (!orders) return (
    <Center justifySelf='center' height='md'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <VStack pt='10' spacing='5' dir='rtl'>
      <HStack w='100%'>
        <Heading size='md' alignSelf='start' >הזמנות</Heading>
      </HStack>
      <Box w='100vw' overflow='auto'>
        <OrdersTable orders={orders} />
      </Box>
    </VStack>
  )
}

export default Orders