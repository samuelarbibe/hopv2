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

import ProductsTable from './Data/ProductsTable'

const Products = () => {
  const history = useHistory()
  const { url } = useRouteMatch()
  const { data: products, isError } = useSWR('/api/products', { refreshInterval: 5000 })

  const [filters, setFilters] = useState({
    inStockOnly: {
      isEnabled: true,
      func: (product) => product.stock
    },
    search: {
      isEnabled: true,
      value: '',
      func: function (product) {
        const lowerCaseName = product.name.toLowerCase()
        const lowerCaseSearchValue = this.value.toLowerCase()
        return lowerCaseName.includes(lowerCaseSearchValue)
      }
    }
  })

  const filteredProducts = useMemo(() => {
    return products?.filter((product) => Object.values(filters).every((filter) => !filter.isEnabled || filter.func(product)))
  }, [products, filters])

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
        <Heading size='md' alignSelf='start' >מוצרים</Heading>
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
      <ProductsTable products={filteredProducts} />
    </VStack>
  )
}

export default Products