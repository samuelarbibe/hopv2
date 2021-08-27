import path from 'path'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import moment from 'moment'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom'

import {
  Heading, VStack, Checkbox,
  Alert, AlertIcon, AlertTitle,
  Center, Spinner, FormControl, FormLabel,
  Input, FormErrorMessage, Textarea, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Button, ButtonGroup, useToast, Select,
  Stack, HStack, Spacer, Box,
} from '@chakra-ui/react'

import { addShippingMethod, deleteShippingMethod, updateShippingMethod } from '../../../utils/shippingMethod'
import DeleteButton from './DeleteButton'
import ShippingMap from './ShippingMap'

const defaultShippingMethod = {
  name: '',
  description: '',
  type: 'pickup',
  stock: 0,
  price: 0,
  tempStock: 0,
  freeAbove: 0,
  from: new Date(),
  to: new Date(),
}

export const shippingTypes = [
  {
    name: 'delivery',
    hebrewName: 'משלוח'
  },
  {
    name: 'pickup',
    hebrewName: 'איסוף עצמי'
  },
]

const EditShippingMethod = () => {
  const toast = useToast()

  const { id } = useParams()
  const history = useHistory()
  const { url } = useRouteMatch()

  const isNew = id === 'new'
  const [tempShippingMethod, setTempShippingMethod] = useState(defaultShippingMethod)
  const [freeAbove, setFreeAbove] = useState(false)
  const { data: shippingMethod, isError } = useSWR(() => id && !isNew ? `/api/shippingMethods/${id}` : null, { refreshInterval: 5000 })

  useEffect(() => {
    if (shippingMethod?._id !== tempShippingMethod?._id) {
      setTempShippingMethod(shippingMethod)
      setFreeAbove(!!shippingMethod.freeAbove)
    }
  }, [shippingMethod, tempShippingMethod?._id])

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load shipping method</AlertTitle>
    </Alert>
  )

  if ((!shippingMethod && !isNew) || !tempShippingMethod) return (
    <Center justifySelf='center' height='md'>
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

  const handleChangeDate = ({ target }) => {
    const newDate = moment(target.value)

    setTempShippingMethod((prev) => ({
      ...prev,
      from: moment(prev.from).set({ year: newDate.get('year'), month: newDate.get('month'), date: newDate.get('date') }).toDate(),
      to: moment(prev.to).set({ year: newDate.get('year'), month: newDate.get('month'), date: newDate.get('date') }).toDate()
    }))
  }

  const handleChangeTime = (key) => ({ target }) => {
    const newTime = moment(target.value, 'HH:mm')

    setTempShippingMethod((prev) => ({
      ...prev,
      [key]: moment(prev[key]).set({ hours: newTime.get('hours'), minutes: newTime.get('minutes') }),
    }))
  }

  const handleChangeArea = (area) => {
    const updatedArea = area.coordinates?.length ? area : undefined
    setTempShippingMethod((prev) => ({
      ...prev,
      area: updatedArea
    }))
  }

  const handleSave = async () => {
    const updatedId = isNew
      ? await addShippingMethod(tempShippingMethod)
      : await updateShippingMethod(tempShippingMethod)

    const successTitle = isNew
      ? 'המשלוח נוסף בהצלחה'
      : 'המשלוח עודכן בהצלחה'

    const errorTitle = isNew
      ? 'אירעה שגיאה בהוספת המשלוח'
      : 'אירעה שגיאה בעדכון המשלוח'

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
    const deletedId = await deleteShippingMethod(shippingMethod._id)

    if (deletedId) {
      toast({
        title: 'המשלוח נמחק בהצלחה',
        status: 'success',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
      history.push(path.normalize(path.join(url, '../../..')))
    } else {
      toast({
        title: 'אירעה שגיאה במחיקת המשלוח',
        status: 'error',
        variant: 'subtle',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const canSave = (
    (
      isNew
        ? JSON.stringify(tempShippingMethod) !== JSON.stringify(defaultShippingMethod)
        : JSON.stringify(tempShippingMethod) !== JSON.stringify(shippingMethod)
    ) &&
    tempShippingMethod.name &&
    tempShippingMethod.description &&
    tempShippingMethod.type &&
    (
      tempShippingMethod.type === 'pickup' ||
      tempShippingMethod.area
    )
  )

  return (
    <VStack pt='10' spacing='5' align='stretch' dir='rtl' pb='10'>
      <HStack w='100%'>
        <Heading size='md' alignSelf='end'>עריכת משלוח</Heading>
        <Spacer />
        {
          !isNew &&
          <DeleteButton
            buttonLabel='מחק משלוח'
            title='למחוק משלוח?'
            description='שים ❤️: לא יהיה אפשר לשחזר אותו'
            onConfirm={handleDelete}
          />
        }
      </HStack>
      <Stack direction={{ base: 'column', md: 'row-reverse' }} alignItems='stretch' spacing='8'>
        <VStack flex='1'>
          <FormControl id="date">
            <FormLabel htmlFor='date'>ביום</FormLabel>
            <Input
              type='date'
              value={moment(tempShippingMethod.from).format('YYYY-MM-DD')}
              onChange={handleChangeDate}
            />
          </FormControl>
          <HStack w='100%' spacing='5'>
            <FormControl id="from">
              <FormLabel htmlFor='from'>משעה</FormLabel>
              <Input
                type='time'
                value={moment(tempShippingMethod.from).format('HH:mm')}
                onChange={handleChangeTime('from')}
              />
            </FormControl>
            <FormControl id="to">
              <FormLabel htmlFor='to'>לשעה</FormLabel>
              <Input
                type='time'
                min={moment(tempShippingMethod.from).format('HH:mm')}
                value={moment(tempShippingMethod.to).format('HH:mm')}
                onChange={handleChangeTime('to')}
              />
            </FormControl>
          </HStack>
          {
            tempShippingMethod.type === 'delivery' &&
            <FormControl id='area' isInvalid={!tempShippingMethod.area}>
              <FormLabel htmlFor='area'>אזור משלוח</FormLabel>
              <Box h='350px' w='100%'>
                <ShippingMap initialArea={tempShippingMethod.area} onChangeArea={handleChangeArea} />
              </Box>
              <FormErrorMessage>אזור המשלוח לא יכול להיות ריק</FormErrorMessage>
            </FormControl>
          }
        </VStack>
        <VStack flex='1'>
          <FormControl id="name" isInvalid={!tempShippingMethod.name.length}>
            <FormLabel htmlFor='name'>שם</FormLabel>
            <Input type="text" id='name' value={tempShippingMethod.name} onChange={handleChange} />
            <FormErrorMessage>שם המשלוח לא יכול להיות ריק</FormErrorMessage>
          </FormControl>
          <FormControl id="type">
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
            <Checkbox isDisabled={!tempShippingMethod.price && !freeAbove} isChecked={freeAbove} onChange={onChangeIsFreeAbove}>חינם מעל סכום </Checkbox>
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
          <FormControl id="stock">
            <FormLabel htmlFor='stock'>מלאי</FormLabel>
            <NumberInput dir='ltr' value={tempShippingMethod.stock} min={isNew ? 0 : shippingMethod.stock - shippingMethod.tempStock} onChange={onStockUpdate}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </VStack>
      </Stack>
      <ButtonGroup pt='5' w='100%' justifyContent='space-between'>
        <Button disabled={!canSave} type='submit' colorScheme='brand' onClick={handleSave}>
          {
            isNew ? 'הוסף משלוח' : 'שמור שינויים'
          }
        </Button>
        <Button disabled={!canSave} type='submit' onClick={() => setTempShippingMethod(isNew ? defaultShippingMethod : shippingMethod)}>שחזר</Button>
      </ButtonGroup>
    </VStack >
  )
}

export default EditShippingMethod