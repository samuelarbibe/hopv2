import React from 'react'
import useSWR from 'swr'
import { useHistory, useRouteMatch } from 'react-router-dom'

import {
  Table, Thead, Tr, Th, Tbody,
  Td, Heading, VStack,
  Alert, AlertIcon, AlertTitle,
  Center, Spinner, IconButton, Tag
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'

const Products = () => {
  const history = useHistory()
  const { url } = useRouteMatch()
  const { data: products, isError } = useSWR('/api/products', { refreshInterval: 5000 })

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load products</AlertTitle>
    </Alert>
  )

  if (!products) return (
    <Center justifySelf='center' height='100%'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <VStack pt='10' spacing='5' dir='rtl'>
      <Heading size='md' alignSelf='start' color='gray.700'>מוצרים</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>שם</Th>
            <Th>מחיר</Th>
            <Th>מלאי זמין</Th>
            <Th>מלאי</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>

          {
            products.map((product, index) => {
              return (
                <Tr key={index}>
                  <Td>{product.name}</Td>
                  <Td>{product.price}</Td>
                  <Td>{product.tempStock}</Td>
                  <Td>
                    {
                      product.stock ||
                      <Tag size='sm' colorScheme='red'>אין במלאי</Tag>
                    }
                  </Td>
                  <Td p='2' isNumeric>
                    <IconButton size='sm' icon={<EditIcon />} onClick={() => history.push(`${url}/edit/product/${product._id}`)} />
                  </Td>
                </Tr>
              )
            })
          }
        </Tbody>
      </Table>
    </VStack>
  )
}

export default Products