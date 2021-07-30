/* eslint-disable react/no-children-prop */
import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import { useHistory, useRouteMatch } from 'react-router-dom'

import {
  Heading, VStack, HStack,
  Alert, AlertIcon, AlertTitle,
  Center, Spinner, Button, Spacer, Checkbox,
  Input, InputGroup, InputRightElement,
} from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'

import ShippingMethodsTable from './Data/ShippingMethodsTable'

const ShippingMethods = () => {
  const history = useHistory()
  const { url } = useRouteMatch()
  const { data: shippingMethods, isError } = useSWR('/api/shippingMethods/all', { refreshInterval: 5000 })

  const [filters, setFilters] = useState({
    inStockOnly: {
      isEnabled: true,
      func: (shippingMethod) => shippingMethod.stock
    },
    search: {
      isEnabled: true,
      value: '',
      func: function (shippingMethod) {
        const lowerCaseName = shippingMethod.name.toLowerCase()
        const lowerCaseSearchValue = this.value.toLowerCase()
        return lowerCaseName.includes(lowerCaseSearchValue)
      }
    }
  })

  const filteredProducts = useMemo(() => {
    return shippingMethods?.filter((shippingMethod) => Object.values(filters).every((filter) => !filter.isEnabled || filter.func(shippingMethod)))
  }, [shippingMethods, filters])

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load shipping methods</AlertTitle>
    </Alert>
  )

  if (!shippingMethods) return (
    <Center justifySelf='center' height='md'>
      <Spinner size='lg' />
    </Center>
  )

  const onFiltersChange = ({ target }) => {
    const isCheckbox = target.type === 'checkbox'
    setFilters((prev) => ({
      ...prev,
      [target.name]: {
        ...prev[target.name],
        isEnabled: isCheckbox ? target.checked : true,
        ...(!isCheckbox && { value: target.value })
      },
    }))
  }

  return (
    <VStack pt='10' spacing='5' dir='rtl'>
      <HStack w='100%'>
        <Heading size='md' alignSelf='start'>משלוחים</Heading>
        <Spacer />
        <Button variant='ghost' colorScheme='green' onClick={() => history.push(`${url}/edit/new`)}>הוסף מוצר חדש</Button>
      </HStack>
      <HStack w='100%' spacing='5'>
        <InputGroup width='200px'>
          <InputRightElement pointerEvents="none" children={<Search2Icon color='gray.300' />} />
          <Input paddingRight='35px' name='search' value={filters.search.value} onChange={onFiltersChange} variant='flushed' placeholder='חפש' />
        </InputGroup>
        <Checkbox name='inStockOnly' isChecked={filters.inStockOnly.isEnabled} onChange={onFiltersChange}>הראה במלאי בלבד</Checkbox>
        <Spacer />
      </HStack>
      <ShippingMethodsTable shippingMethods={filteredProducts} />
    </VStack>
  )
}

export default ShippingMethods