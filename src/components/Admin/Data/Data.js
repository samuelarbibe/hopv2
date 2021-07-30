import React, { useMemo } from 'react'
import useSWR from 'swr'
import { VStack, Center, Spinner, Alert, AlertIcon, AlertTitle, Heading } from '@chakra-ui/react'

import Carts from './Carts'
import ProductsTable from './ProductsTable'
import ShippingMethodsTable from './ShippingMethodsTable'

const Data = () => {
  const { data: shippingMethods, isErrorShippingMethod } = useSWR('/api/shippingMethods/all', { refreshInterval: 5000 })
  const { data: products, isErrorProducts } = useSWR('/api/products/all', { refreshInterval: 5000 })

  const filteredProducts = useMemo(() => products?.filter((product) => product.stock), [products])
  const filterShippingMethods = useMemo(() => shippingMethods?.filter((shippingMethod) => shippingMethod.stock), [shippingMethods])

  if (isErrorShippingMethod || isErrorProducts) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load data</AlertTitle>
    </Alert>
  )

  if (!shippingMethods || !products) return (
    <Center justifySelf='center' height='md'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <VStack align='stretch' dir='rtl' spacing='10' py='50px'>
      <Heading size='md' alignSelf='start' >מוצרים</Heading>
      <ProductsTable products={filteredProducts} summary />

      <Heading size='md' alignSelf='start' >משלוחים</Heading>
      <ShippingMethodsTable shippingMethods={filterShippingMethods} summary />

      <Carts />
    </VStack>
  )
}

export default Data