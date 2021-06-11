import { useContext } from "react"
import useSWR from "swr"

import { Box, Button, Clock, DataTable, Image, ResponsiveContext, Spinner, Text } from "grommet"
import { Add, Close, Subtract } from "grommet-icons"
import { emptyCart, updateCart } from "../utils/cart"

const Cart = () => {
  const size = useContext(ResponsiveContext)
  const largeSizeDevice = size !== 'small'

  const { data: cart, isError: isCartError } = useSWR(
    '/api/cart',
    { refreshInterval: 5000 }
  )
  const { data: products, isError: isProductsError } = useSWR('/api/products')

  if (isCartError || isProductsError) return (
    <Box flex justify='center' align='center'>
      <Text>Could not load Cart</Text>
    </Box>
  )

  if (!cart || !products) return (
    <Box flex justify='center' align='center'>
      <Spinner size='medium' />
    </Box>
  )

  if (cart.items.length === 0) return (
    <Box flex justify='center' align='center'>
      <Text size='large'>העגלה ריקה</Text>
    </Box>
  )

  const handleEmptyCart = async () => {
    try {
      await emptyCart()
    } catch (error) {
      console.log('Could not empty cart')
    }
  }

  const cartItems = cart.items.map((item) => {
    const product = products.find((product) => product._id === item.productId)
    return { ...item, ...product }
  })

  const handleClick = async (id, actionType) => {
    switch (actionType) {
      case 'add':
        await updateCart(id, 1)
        break
      case 'subtract':
        await updateCart(id, -1)
        break
      default:
        break
    }
  }

  const columns = [
    {
      property: 'images',
      primary: true,
      render: ({ images }) => {
        return (
          <Image src={images[0]} fit='cover' height='80px' />
        )
      }
    },
    {
      property: 'price',
      render: (item) => {
        return (
          <Box height={largeSizeDevice ? 'small' : 'xsmall'}>
            <Box direction='row' justify='between'>
              <Text margin='small' color='dark-1' size={largeSizeDevice ? 'large' : 'medium'} weight='bold'>{item.name}</Text>
              <Button icon={<Close size='20px' />} />
            </Box>
            <Box flex='grow' />
            <Box justify='between' align='center' direction='row'>
              {
                item.tempStock
                  ? (
                    <Box direction='row'>
                      <Button disabled={item.amount === item.tempStock} secondary fill={false} icon={<Add />} onClick={() => handleClick(item._id, 'add')} />
                      <Text color='dark-1' alignSelf='center' size='large' margin={{ horizontal: 'small' }}>{item.amount}</Text>
                      <Button disabled={item.amount === 1} secondary fill={false} icon={<Subtract />} onClick={() => handleClick(item._id, 'subtract')} />
                    </Box>
                  )
                  : <Text color='red'>אין במלאי</Text>
              }
              <Box direction='row'>
                <Text color='dark-1' alignSelf='center' weight='bold'>
                  {item.amount * item.price}
                </Text>
                <Text alignSelf='center' weight='bold' margin={{ horizontal: 'xxsmall' }}>
                  ₪
            </Text>
              </Box>
            </Box>
          </Box>
        )
      },
    }
  ]

  const cartCreationDate = new Date(cart.createdAt)
  const cartExpireDate = new Date(cartCreationDate.getTime() + 1000 * 60 * 15)
  const cartRemainingTime = new Date(cartExpireDate - new Date()).toISOString()

  return (
    <Box
      pad='medium'
      gap='medium'
      height='500px'
      flex={largeSizeDevice ? 'shrink' : 'grow'}
    >
      <Box color='dark-1' justify='end' direction='row' gap='xsmall'>
        <Clock type="digital" run='backward' time={cartRemainingTime} />
        <Text dir='rtl'>שים לב: העגלה תפוג עוד </Text>
      </Box>
      <DataTable
        columns={columns}
        data={cartItems}
        border="bottom"
        pad='xsmall'
      />
      <Box pad='medium' flex={largeSizeDevice} direction='row' align='start' justify='between'>
        <Button onClick={handleEmptyCart} size='large' secondary label='רוקן עגלה' />
        <Button size='large' primary label='המשך' />
      </Box>
    </Box >
  )
}

export default Cart