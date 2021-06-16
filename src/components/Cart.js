import useSWR from 'swr'
import { useHistory } from 'react-router-dom'

import {
  Spinner, Alert, AlertIcon, AlertTitle,
  Text, VStack, Center, Button,
  SlideFade, Table, Tr, Tbody, Td, Image,
  HStack, Drawer, DrawerOverlay, DrawerCloseButton,
  DrawerContent, DrawerFooter, DrawerBody
} from '@chakra-ui/react'
import { useCartTimer } from './CartTimer'
import { useCart } from '../hooks/useCart'
import { useMemo } from 'react'

const Cart = () => {
  const history = useHistory()
  const { isOpen, onClose } = useCart()
  const { data: cart, isError: isCartError } = useSWR('/api/cart', { refreshInterval: 5000 })
  const { data: products, isError: isProductsError } = useSWR('/api/products')
  const { data: cartTimer, isError: isCartTimerError } = useCartTimer()

  const errors = useMemo(() => {
    if (isCartError || isProductsError || isCartTimerError) return (
      <Alert status='error' dir='rtl'>
        <AlertIcon />
        <AlertTitle>אירעה שגיאה בטעינת העגלה</AlertTitle>
      </Alert>
    )

    if (!products || !cart || !cartTimer) return (
      <Center justifySelf='center' height='100%'>
        <Spinner size='lg' />
      </Center>
    )

    if (cart.items.length === 0) return (
      <Center justifySelf='center' height='100%'>
        <Text fontSize='xl'>העגלה ריקה</Text>
      </Center>
    )

    return null
  }, [cart, cartTimer, isCartError, isCartTimerError, isProductsError, products])

  const cartItems = useMemo(() => {
    if (errors) return []

    return cart.items.map((item) => {
      const product = products.find((product) => product._id === item.productId)
      return { ...item, ...product }
    })
  }, [cart, products, errors])

  const intermidiateSum = cartItems.reduce((acc, curr) => {
    return acc + curr.amount * curr.price
  }, 0)

  const handleClickProceed = async () => {

  }

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      size='sm'
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        {
          errors ||
          <>
            <DrawerBody pt='10'>
              <VStack py='5' align='stretch' width='100%'>
                <Text dir='rtl'>
                  שים לב: העגלה תפוג עוד {cartTimer}
                </Text>
                <Table variant='simple'>
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
                <HStack dir='rtl' justify='space-between'>
                  <Text fontSize='lg' fontWeight='bold' color='gray.700' >סכום ביניים</Text>
                  <Text fontSize='lg' color='gray.600' >{intermidiateSum} ₪ </Text>
                </HStack>
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              <SlideFade in={true}>
                <Button
                  dir='rtl'
                  colorScheme='pink'
                  size='lg'
                  isFullWidth
                  onClick={() => handleClickProceed()}
                >
                  המשך לבחירת משלוח
                </Button>
              </SlideFade>
            </DrawerFooter>
          </>
        }
      </DrawerContent>
    </Drawer>
  )
}

export default Cart