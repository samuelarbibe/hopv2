import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'

import {
  Heading, VStack, Checkbox,
  Alert, AlertIcon, AlertTitle,
  Center, Spinner, FormControl, FormLabel,
  Input, FormErrorMessage, Textarea, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Button, ButtonGroup, useToast, Select,
  Stack, HStack,
} from '@chakra-ui/react'

import { updatedShippingMethod } from '../../../utils/shippingMethod'
import DatePicker from '../../../libs/datepicker/DatePicker'

const EditShippingMethod = () => {
  const toast = useToast()
  const { id } = useParams()
  const [tempShippingMethod, setTempShippingMethod] = useState(null)
  const [freeAbove, setFreeAbove] = useState(false)
  const { data: shippingMethod, isError } = useSWR(() => id ? `/api/shippingMethods/${id}` : null, { refreshInterval: 5000 })

  useEffect(async () => {
    if (shippingMethod?._id !== tempShippingMethod?._id) {
      setTempShippingMethod(shippingMethod)
      setFreeAbove(!!shippingMethod.freeAbove)
    }
  }, [shippingMethod])

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load shipping method</AlertTitle>
    </Alert>
  )

  if (!shippingMethod || !tempShippingMethod) return (
    <Center justifySelf='center' height='100%'>
      <Spinner size='lg' />
    </Center>
  )

  const handleChange = (event) => {
    const { value, id } = event.target

    setTempShippingMethod((prev) => ({
      ...prev,
      [id]: value
    }))
  }

  const onStockUpdate = (value) => {
    const newValue = +value
    const diff = tempShippingMethod.stock - newValue
    setTempShippingMethod((prev) => ({
      ...prev,
      stock: newValue,
      tempStock: tempShippingMethod.tempStock - diff
    }))
  }

  const formatPrice = (val) => '₪' + val
  const parsePrice = (val) => val.replace(/^₪/, '')

  const onPriceUpdate = (value) => {
    if (!+value) setFreeAbove(false)
    setTempShippingMethod((prev) => ({
      ...prev,
      price: +value,
      freeAbove: +value ? prev.freeAbove : 0,
    }))
  }

  const onChangeIsFreeAbove = ({ target }) => {
    const isFreeAbove = target.checked
    setFreeAbove(isFreeAbove)
    setTempShippingMethod((prev) => ({ ...prev, freeAbove: isFreeAbove ? 1 : 0 }))
  }

  const onFreeAboveUpdate = (value) => {
    setTempShippingMethod((prev) => ({
      ...prev,
      freeAbove: +value
    }))
  }

  const handleDateChange = (value) => {
    const newDate = value.getDate()

    setTempShippingMethod((prev) => ({
      ...prev,
      from: new Date(prev.from).setDate(newDate),
      to: new Date(prev.to).setDate(newDate),
    }))
  }

  const handleTimeChange = (value, key) => {
    const newTime = value.getTime()

    setTempShippingMethod((prev) => ({
      ...prev,
      [key]: new Date(prev[key]).setTime(newTime),
    }))
  }

  const handleSave = async () => {
    const success = await updatedShippingMethod(tempShippingMethod)
    if (success) {
      toast({
        title: 'המשלוח עודכן בהצלחה',
        status: 'success',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'אירעה שגיאה בעדכון המשלוח',
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const canSave = (
    JSON.stringify(tempShippingMethod) !== JSON.stringify(shippingMethod)
  )

  const shippingTypes = [
    {
      name: 'delivery',
      hebrewName: 'משלוח'
    },
    {
      name: 'pickup',
      hebrewName: 'איסוף עצמי'
    },
  ]

  return (
    <VStack pt='10' spacing='5' align='stretch' dir='rtl' pb='10'>
      <Heading size='md' alignSelf='end' color='gray.700'>עריכת משלוח</Heading>
      <Stack direction={{ base: 'column', md: 'row-reverse' }} alignItems='stretch' spacing='8'>
        <VStack flex='1'>
          <FormControl id="stock">
            <FormLabel htmlFor='stock'>מלאי</FormLabel>
            <NumberInput dir='ltr' value={tempShippingMethod.stock} min={shippingMethod.stock - shippingMethod.tempStock} onChange={onStockUpdate}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl id="date">
            <FormLabel htmlFor='date'>ביום</FormLabel>
            <DatePicker selected={new Date(tempShippingMethod.from)} onChange={handleDateChange} dateFormat="dd/MM/yyyy" />
          </FormControl>
          <HStack w='100%' spacing='5'>
            <FormControl id="from">
              <FormLabel htmlFor='from'>משעה</FormLabel>
              <DatePicker
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                selected={new Date(tempShippingMethod.from)}
                onChange={(value) => handleTimeChange(value, 'from')}
                dateFormat='HH:mm'
                timeFormat='HH:mm'
              />
            </FormControl>
            <FormControl id="to">
              <FormLabel htmlFor='to'>לשעה</FormLabel>
              <DatePicker
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                filterTime={(time) => time > new Date(tempShippingMethod.from).getTime()}
                selected={new Date(tempShippingMethod.to)}
                onChange={(value) => handleTimeChange(value, 'to')}
                dateFormat='HH:mm'
                timeFormat='HH:mm'
              />
            </FormControl>
          </HStack>
        </VStack>
        <VStack flex='1'>
          <FormControl id="name" isInvalid={!tempShippingMethod.name.length}>
            <FormLabel htmlFor='name'>שם</FormLabel>
            <Input type="text" id='name' value={tempShippingMethod.name} onChange={handleChange} />
            <FormErrorMessage>שם המשלוח לא יכול להיות ריק</FormErrorMessage>
          </FormControl>
          <FormControl id="type" isInvalid={!tempShippingMethod.name.length}>
            <FormLabel htmlFor='type'>סוג</FormLabel>
            <Select id='type' value={tempShippingMethod.type} onChange={handleChange} dir='ltr'>
              {
                shippingTypes.map((type, index) => {
                  return (
                    <option key={index} value={type.name}>{type.hebrewName}</option>
                  )
                })
              }
            </Select>
            <FormErrorMessage>שם המשלוח לא יכול להיות ריק</FormErrorMessage>
          </FormControl>
          <FormControl id="description" isInvalid={!tempShippingMethod.description.length}>
            <FormLabel htmlFor='description'>תיאור</FormLabel>
            <Textarea id='description' value={tempShippingMethod.description} onChange={handleChange} />
            <FormErrorMessage>תיאור המשלוח לא יכול להיות ריק</FormErrorMessage>
          </FormControl>
          <FormControl id="price">
            <FormLabel htmlFor='price'>מחיר</FormLabel>
            <NumberInput dir='ltr' value={formatPrice(tempShippingMethod.price)} min={0} onChange={(value) => onPriceUpdate(parsePrice(value))}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl py='3'>
            <Checkbox isDisabled={!tempShippingMethod.price} isChecked={freeAbove} onChange={onChangeIsFreeAbove}>חינם מעל סכום </Checkbox>
          </FormControl>
          {
            freeAbove &&
            <FormControl id="freeAbove">
              <NumberInput dir='ltr' value={formatPrice(tempShippingMethod.freeAbove)} min={1} onChange={(value) => onFreeAboveUpdate(parsePrice(value))}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          }
        </VStack>
      </Stack>
      <ButtonGroup pt='5' w='100%' justifyContent='space-between'>
        <Button disabled={!canSave} type='submit' colorScheme='pink' onClick={handleSave}>שמור שינויים</Button>
        <Button disabled={!canSave} type='submit' onClick={() => setTempShippingMethod(shippingMethod)}>שחזר</Button>
      </ButtonGroup>
    </VStack >
  )
}

export default EditShippingMethod