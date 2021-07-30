import React from 'react'
import useSWR from 'swr'

import {
  Heading, VStack, Alert, AlertIcon, AlertTitle,
  Center, Spinner,
} from '@chakra-ui/react'

import ConstsTable from './Data/ConstsTable'

const Consts = () => {
  const { data: consts, isError } = useSWR('/api/consts')

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load consts</AlertTitle>
    </Alert>
  )

  if (!consts) return (
    <Center justifySelf='center' height='md'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <VStack pt='10' spacing='5' dir='rtl'>
      <Heading size='md' alignSelf='start' >משתני סביבה</Heading>
      <ConstsTable consts={consts} />
    </VStack>
  )
}

export default Consts