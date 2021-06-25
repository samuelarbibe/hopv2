import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'

import {
  Heading, VStack,
  Alert, AlertIcon, AlertTitle,
  Center, Spinner, Stack, FormControl, FormLabel,
  Input, FormErrorMessage, Textarea, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Button, ButtonGroup, useToast
} from '@chakra-ui/react'
import { updateProduct } from '../../../utils/products'

import ImagesEditor from './EditImages'

const EditProduct = () => {
  const toast = useToast()
  const { id } = useParams()
  const [tempProduct, setTempProduct] = useState(null)
  const { data: product, isError } = useSWR(() => id ? `/api/products/${id}` : null, { refreshInterval: 5000 })

  useEffect(async () => {
    if (product?._id !== tempProduct?._id) {
      setTempProduct(product)
    }
  }, [product])

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load product</AlertTitle>
    </Alert>
  )

  if (!product || !tempProduct) return (
    <Center justifySelf='center' height='100%'>
      <Spinner size='lg' />
    </Center>
  )

  const handleChange = (event) => {
    const { value, id } = event.target

    setTempProduct((prev) => ({
      ...prev,
      [id]: value
    }))
  }

  const onStockUpdate = (value) => {
    const newValue = +value
    const diff = tempProduct.stock - newValue
    setTempProduct((prev) => ({
      ...prev,
      stock: newValue,
      tempStock: tempProduct.tempStock - diff
    }))
  }

  const formatPrice = (val) => '₪' + val
  const parsePrice = (val) => val.replace(/^₪/, '')

  const onPriceUpdate = (value) => {
    setTempProduct((prev) => ({
      ...prev,
      price: +value
    }))
  }

  const onImagesUpdate = (newImages) => {
    setTempProduct((prev) => ({
      ...prev,
      images: newImages
    }))
  }

  const handleSave = async () => {
    const success = await updateProduct(tempProduct)
    if (success) {
      toast({
        title: 'המוצר עודכן בהצלחה',
        status: 'success',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'אירעה שגיאה בעדכון המוצר',
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }


  const canSave = (
    JSON.stringify(tempProduct) !== JSON.stringify(product)
  )

  return (
    <VStack pt='10' spacing='5' align='stretch' dir='rtl' pb='10'>
      <Heading size='md' alignSelf='end' color='gray.700'>עריכת מוצר</Heading>
      <Stack direction={{ base: 'column', md: 'row-reverse' }} alignItems='stretch' spacing='8'>
        <ImagesEditor imageUrls={tempProduct.images} onChange={onImagesUpdate} />
        <VStack flex='1'>
          <FormControl id="name" isInvalid={!tempProduct.name.length}>
            <FormLabel htmlFor='name'>שם</FormLabel>
            <Input type="text" id='name' value={tempProduct.name} onChange={handleChange} />
            <FormErrorMessage>שם המוצר לא יכול להיות ריק</FormErrorMessage>
          </FormControl>
          <FormControl id="description" isInvalid={!tempProduct.description.length}>
            <FormLabel htmlFor='description'>תיאור</FormLabel>
            <Textarea id='description' value={tempProduct.description} onChange={handleChange} />
            <FormErrorMessage>תיאור המוצר לא יכול להיות ריק</FormErrorMessage>
          </FormControl>
          <FormControl id="price">
            <FormLabel htmlFor='price'>מחיר</FormLabel>
            <NumberInput dir='ltr' value={formatPrice(tempProduct.price)} min={0} onChange={(value) => onPriceUpdate(parsePrice(value))}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl id="stock">
            <FormLabel htmlFor='stock'>מלאי</FormLabel>
            <NumberInput dir='ltr' value={tempProduct.stock} min={product.stock - product.tempStock} onChange={onStockUpdate}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <ButtonGroup pt='5' w='100%' justifyContent='space-between'>
            <Button disabled={!canSave} type='submit' colorScheme='pink' onClick={handleSave}>שמור שינויים</Button>
            <Button disabled={!canSave} type='submit' onClick={() => setTempProduct(product)}>שחזר</Button>
          </ButtonGroup>
        </VStack>
      </Stack>
    </VStack >
  )
}

export default EditProduct