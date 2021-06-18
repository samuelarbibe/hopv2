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
                    <Text fontSize='md' fontWeight='bold' color='gray.700' >
                      {item.name}
                    </Text>
                  </Td>
                  <Td p='1'>
                    <Text width='30px' fontSize='md' fontWeight='bold' color='gray.700' >
                      {item.amount} X
                    </Text>
                  </Td>
                  <Td p='1' isNumeric wordBreak='unset'>
                    <Text width='50px' fontWeight='bold' color='gray.700' >
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
        <Text fontSize='lg' fontWeight='bold' color='gray.700' >סכום ביניים</Text>
        <Text fontSize='lg' color='gray.600' >{intermidiateSum} ₪ </Text>
      </HStack>
      <HStack justify='space-between'>
        <Text fontSize='lg' fontWeight='bold' color='gray.700' >משלוח</Text>
        <Text fontSize='lg' color='gray.600' >{selectedShippingMethod ? `${selectedShippingMethod.price} ₪` : 'לא נבחר'}</Text>
      </HStack>
    </VStack>
  )
}

export default Cart