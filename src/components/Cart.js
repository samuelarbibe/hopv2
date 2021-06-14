import useSWR from "swr"
import { useHistory } from "react-router-dom"

import {
  Spinner, Alert, AlertIcon, AlertTitle,
  Text, VStack, Center, Box, Spacer, Button,
  SlideFade, Table, Tr, Tbody, Td, Image, Stack, HStack, IconButton
} from "@chakra-ui/react"
import { useCartTimer } from "./CartTimer"
import { ArrowBackIcon } from "@chakra-ui/icons"

const Cart = () => {
  const history = useHistory()
  const { data: cart, isError: isCartError } = useSWR('/api/cart', { refreshInterval: 5000 })
  const { data: products, isError: isProductsError } = useSWR('/api/products')
  const { data: cartTimer, isError: isCartTimerError } = useCartTimer()

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
      <VStack>
        <Text fontSize='xl'>העגלה ריקה</Text>
        <Button dir='rtl' onClick={() => history.push('/')}>הביתה!</Button>
      </VStack>
    </Center>
  )

  const cartItems = cart.items.map((item) => {
    const product = products.find((product) => product._id === item.productId)
    return { ...item, ...product }
  })

  const intermidiateSum = cartItems.reduce((acc, curr) => {
    return acc + curr.amount * curr.price
  }, 0)

  const handleClickProceed = async () => {

  }

  return (
    <VStack py='5' justify='stretch'>
      <IconButton
        colorScheme="pink"
        variant="ghost"
        mb='2'
        alignSelf='start'
        fontSize='25'
        icon={<ArrowBackIcon />}
        onClick={() => history.goBack()}
      />
      <Text>
        שים לב: העגלה תפוג עוד {cartTimer}
      </Text>
      <Stack direction={{ base: 'column', md: 'row' }} spacing='8' width='100%'>
        <Box flex={1}>
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
        </Box>
        <VStack align='stretch' flex={1}>
          <HStack dir='rtl' justify='space-between'>
            <Text fontSize='lg' fontWeight='bold' color='gray.700' >סכום ביניים</Text>
            <Text fontSize='lg' color='gray.600' >{intermidiateSum} ₪ </Text>
          </HStack>
          <Spacer />
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
        </VStack>
      </Stack >
    </VStack >
  )
}

export default Cart