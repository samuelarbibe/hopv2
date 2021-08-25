import path from 'path'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useParams, useHistory, useRouteMatch } from 'react-router-dom'

import {
  Heading, VStack, HStack,
  Alert, AlertIcon, AlertTitle,
  Center, Spinner, Stack, FormControl, FormLabel,
  Input, FormErrorMessage, Textarea, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Button, ButtonGroup, useToast, Spacer
} from '@chakra-ui/react'
import { addProduct, deleteProduct, updateProduct } from '../../../utils/products'

import ImagesEditor from './EditImages'
import DeleteButton from './DeleteButton'

const defaultProduct = {
  name: '',
  price: 0,
  stock: 0,
  tempStock: 0,
  images: [],
  description: '',
}

const EditProduct = () => {
  const toast = useToast()

  const { id } = useParams()
  const history = useHistory()
  const { url } = useRouteMatch()

  const isNew = id === 'new'
  const [tempProduct, setTempProduct] = useState(defaultProduct)
  const { data: product, isError } = useSWR(() => id && !isNew ? `/api/products/${id}` : null, { refreshInterval: 5000 })

  useEffect(() => {
    if (product?._id !== tempProduct?._id) {
      setTempProduct(product)
    }
  }, [product, tempProduct?._id])

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load product</AlertTitle>
    </Alert>
  )

  if ((!product && !isNew) || !tempProduct) return (
    <Center justifySelf='center' height='md'>
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
    const updatedId = isNew
      ? await addProduct(tempProduct)
      : await updateProduct(tempProduct)

    const successTitle = isNew
      ? 'המוצר נוסף בהצלחה'
      : 'המוצר עודכן בהצלחה'

    const errorTitle = isNew
      ? 'אירעה שגיאה בהוספת המוצר'
      : 'אירעה שגיאה בעדכון המוצר'

    if (updatedId) {
      toast({
        title: successTitle,
        status: 'success',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
      history.replace(path.normalize(path.join(url, `../${updatedId}`)))
    } else {
      toast({
        title: errorTitle,
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async () => {
    const deletedId = await deleteProduct(tempProduct._id)

    if (deletedId) {
      toast({
        title: 'המוצר נמחק בהצלחה',
        status: 'success',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
      history.push(path.normalize(path.join(url, '../../..')))
    } else {
      toast({
        title: 'אירעה שגיאה במחיקת המוצר',
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const canSave = (
    isNew
      ? JSON.stringify(tempProduct) !== JSON.stringify(defaultProduct)
      : JSON.stringify(tempProduct) !== JSON.stringify(product)
  )

  return (
    <VStack pt='10' spacing='5' align='stretch' dir='rtl' pb='10'>
      <HStack w='100%'>
        <Heading size='md' alignSelf='end' >עריכת מוצר</Heading>
        <Spacer />
        {
          !isNew &&
          <DeleteButton
            buttonLabel='מחק מוצר'
            title='למחוק מוצר?'
            description='שים ❤️: לא יהיה אפשר לשחזר אותו'
            onConfirm={handleDelete}
          />
        }
      </HStack>
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
            <NumberInput dir='ltr' value={tempProduct.stock} min={isNew ? 0 : product.stock - product.tempStock} onChange={onStockUpdate}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <ButtonGroup pt='5' w='100%' justifyContent='space-between'>
            <Button disabled={!canSave} type='submit' colorScheme='brand' onClick={handleSave}>
              {
                isNew ? 'הוסף מוצר' : 'שמור שינויים'
              }
            </Button>
            <Button disabled={!canSave} type='submit' onClick={() => setTempProduct(isNew ? defaultProduct : product)}>שחזר</Button>
          </ButtonGroup>
        </VStack>
      </Stack>
    </VStack >
  )
}

export default EditProduct