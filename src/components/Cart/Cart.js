import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'

import {
  Text, VStack,
  Table, Tr, Tbody, Td, Image,
  HStack, Heading
} from '@chakra-ui/react'

const Cart = ({ cart, products, shippingMethods }) => {
  const history = useHistory()

  const cartItems = useMemo(() => {
    return cart.items.map((item) => {
      const product = products.find((product) => product._id === item.productId)
      return { ...item, ...product }
    })
  }, [cart, products])

  const intermidiateSum = cartItems.reduce((acc, curr) => {
    return acc + curr.amount * curr.price
  }, 0)

  const selectedShippingMethod = useMemo(() => {
    return shippingMethods.find((method) => method._id === cart.shippingMethod)
  }, [cart, shippingMethods])

  return (
    <VStack py='5' align='stretch' width='100%' dir='rtl'>
      <Heading mb='2'>עגלה</Heading>
      <Table variant='simple' dir='ltr'>
        <Tbody>
          {
            cartItems.map((item, index) => {
              return (
                <Tr key={index} onClick={() => history.push(`/product/${item._id}`)}>
                  <Td p='1' width={{ base: '100px', md: '150px' }}>
                    <Image src={item.images[0]} height={{ base: '100px', md: '150px' }} />
                  </Td>
                  <Td p='1'>
                    <Text fontSize='md' fontWeight='bold'  >
                      {item.name}
                    </Text>
                  </Td>
                  <Td p='1'>
                    <Text width='30px' fontSize='md' fontWeight='bold'  >
                      {item.amount} X
                    </Text>
                  </Td>
                  <Td p='1' isNumeric wordBreak='unset'>
                    <Text width='50px' fontWeight='bold'  >
                      {item.price * item.amount} ₪
                    </Text>
                  </Td>
                </Tr>
              )
            })
          }
        </Tbody>
      </Table>
      <HStack justify='space-between'>
        <Text fontSize='lg' fontWeight='bold' color='gray.800'>סכום ביניים</Text>
        <Text fontSize='lg' >{intermidiateSum} ₪ </Text>
      </HStack>
      <HStack justify='space-between'>
        <Text fontSize='lg' fontWeight='bold' color='gray.800' >{!selectedShippingMethod || selectedShippingMethod.type === 'delivery' ? 'משלוח' : 'איסוף עצמי'}</Text>
        <Text fontSize='lg'>
          {selectedShippingMethod
            ? (
              (!selectedShippingMethod.price ||
                (selectedShippingMethod.freeAbove && intermidiateSum > selectedShippingMethod.freeAbove))
                ? 'חינם' : `${selectedShippingMethod.price} ₪`
            )
            : ' לא נבחר'}
        </Text>
      </HStack>
    </VStack>
  )
}

export default Cart