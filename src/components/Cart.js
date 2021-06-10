import { useContext } from "react"
// import { useHistory } from "react-router"
import useSWR from "swr"

import { Box, Main, ResponsiveContext, Spinner, Text } from "grommet"

const Cart = () => {
  // const history = useHistory()
  const { data: cart, isError } = useSWR('/api/cart')

  const size = useContext(ResponsiveContext)
  const largeSizeDevice = size !== 'small'

  if (isError) return (
    <Box height='large' align='center'>
      <Text>Could not load Cart</Text>
    </Box>
  )

  if (!cart) return (
    <Box style={{ position: 'absolute', top: '50%', left: '45%' }}>
      <Spinner size='medium' />
    </Box>
  )

  return (
    <Main
      pad='medium'
      direction={largeSizeDevice ? 'row' : 'column'}
      gap='medium'
      wrap
      justify='center'
    >

    </Main >
  )
}

export default Cart