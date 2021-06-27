import React from 'react'
import useSWR from 'swr'
import { useHistory, useRouteMatch } from 'react-router-dom'

import {
  Table, Thead, Tr, Th, Tbody,
  Td, Heading, VStack, HStack,
  Alert, AlertIcon, AlertTitle,
  Center, Spinner, IconButton, Tag,
  Button, Spacer,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'

const ShippingMethods = () => {
  const history = useHistory()
  const { url } = useRouteMatch()
  const { data: shippingMethods, isError } = useSWR('/api/shippingMethods', { refreshInterval: 5000 })

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load shipping methods</AlertTitle>
    </Alert>
  )

  if (!shippingMethods) return (
    <Center justifySelf='center' height='100%'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <VStack pt='10' spacing='5' dir='rtl'>
      <HStack w='100%'>
        <Heading size='md' alignSelf='start' color='gray.700'>משלוחים</Heading>
        <Spacer />
        <Button variant='ghost' colorScheme='green' onClick={() => history.push(`${url}/edit/shippingMethod/new`)}>הוסף משלוח חדש</Button>
      </HStack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>שם</Th>
            <Th>סוג</Th>
            <Th>מחיר</Th>
            <Th>מלאי זמין</Th>
            <Th>מלאי</Th>
            <Th>תיאור</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            shippingMethods.map((shippingMethod, index) => {
              return (
                <Tr key={index}>
                  <Td>{shippingMethod.name}</Td>
                  <Td>{shippingMethod.type}</Td>
                  <Td>{shippingMethod.price}</Td>
                  <Td>{shippingMethod.tempStock}</Td>
                  <Td>
                    {
                      shippingMethod.stock ||
                      <Tag size='sm' colorScheme='red'>אין במלאי</Tag>
                    }
                  </Td>
                  <Td>{shippingMethod.description}</Td>
                  <Td p='2' isNumeric>
                    <IconButton size='sm' icon={<EditIcon />} onClick={() => history.push(`${url}/edit/shippingMethod/${shippingMethod._id}`)} />
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

export default ShippingMethods