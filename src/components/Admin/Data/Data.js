import React from 'react'
import { VStack } from '@chakra-ui/layout'

import Carts from './Carts'
import Products from './Products'
import ShippingMethods from './ShippingMethods'

const Data = () => {
  return (
    <VStack align='stretch'>
      <Products />
      <ShippingMethods />
      <Carts />
    </VStack>
  )
}

export default Data