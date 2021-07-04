import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useDebounce } from 'use-debounce'

import {
  VStack, Heading, FormControl, FormLabel, Input,
  Text, FormHelperText, InputLeftElement,
  InputGroup, Spinner, FormErrorMessage, Box, Switch,
  Alert, AlertIcon, AlertTitle
} from '@chakra-ui/react'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { setCustomerAddress } from '../../utils/cart'
import { useConsts } from '../../hooks/useConsts'

const useAddress = (customerAddress) => {
  const addressWithCity = customerAddress + ' תל אביב יפו'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchAddress = async () => {
      setError(false)
      setIsLoading(true)
      try {
        const { data } = await axios.get(`/api/address/geocode/${addressWithCity}`)
        setData(data)
      } catch (error) {
        setError('אופס! אנחנו לא שולחים לשם...')
        setData(null)
      }
      setIsLoading(false)
    }

    if (customerAddress) {
      fetchAddress()
    }
  }, [customerAddress])


  return { data, error, isLoading }
}

const AddressInput = ({ defaultValue, onChange }) => {
  const [customerAddress, setCustomerAddress] = useState(defaultValue)
  const [touched, setTouched] = useState(false)
  const [debouncedCustomerAddress] = useDebounce(customerAddress, 1000)
  const { data: parsedAddress, error: addressError, isLoading: isAddressLoading } = useAddress(debouncedCustomerAddress.replace(/\s+/g, ' ').trim())

  const handleChange = ({ target }) => {
    const { value } = target
    setTouched(true)
    setCustomerAddress(value)
  }

  const isLoading = debouncedCustomerAddress !== customerAddress || isAddressLoading
  const isError = addressError && touched
  const isValid = parsedAddress && !isLoading && !isError
  const fullAddress = isValid && `${parsedAddress.streetName} ${parsedAddress.streetNumber}, ${parsedAddress.city}`

  useEffect(() => {
    onChange(isValid && fullAddress)
  }, [isValid, parsedAddress])

  const renderLeftChildren = () => {
    let children = null
    if (isLoading) children = <Spinner />
    else if (isError) children = <CloseIcon color='tomato' />
    else if (isValid) children = <CheckIcon color="green.500" />

    // eslint-disable-next-line react/no-children-prop
    return <InputLeftElement children={children} />
  }

  const renderHelperText = () => {
    if (isError) return <FormErrorMessage>{addressError}</FormErrorMessage>
    if (isValid) return <FormHelperText>{fullAddress}</FormHelperText>
    return null
  }

  return (
    <FormControl id="address" isInvalid={isError}>
      <FormLabel>כתובת</FormLabel>
      <InputGroup>
        <Input pr='16px' placeholder='לדוגמה: הרצל 33' type="text" value={customerAddress} onChange={handleChange} />
        {
          renderLeftChildren()
        }
      </InputGroup>
      {
        renderHelperText()
      }
    </FormControl>
  )
}

const HouseNumberInput = ({ defaultValue, onChange }) => {
  const [customerHouseNumber, setCustomerHouseNunmber] = useState(defaultValue)
  const [touched, setTouched] = useState(false)
  const [debouncedCustomerHouseNumber] = useDebounce(customerHouseNumber, 1000)

  const isLoading = customerHouseNumber !== debouncedCustomerHouseNumber
  const isError = touched && !customerHouseNumber && !isLoading
  const isValid = !isError && !isLoading && customerHouseNumber

  const handleChange = ({ target }) => {
    const { value } = target
    if (value === '' || Number(value) > 0) {
      setTouched(true)
      setCustomerHouseNunmber(value)
    }
  }

  useEffect(() => {
    onChange(isValid && customerHouseNumber)
  }, [isValid, customerHouseNumber])

  const renderLeftChildren = () => {
    let children = null
    if (isLoading) children = <Spinner />
    else if (isError) children = <CloseIcon color='tomato' />
    else if (isValid) children = <CheckIcon color="green.500" />

    // eslint-disable-next-line react/no-children-prop
    return <InputLeftElement children={children} />
  }

  return (
    <FormControl id="houseNumber" isInvalid={isError}>
      <FormLabel>מספר דירה</FormLabel>
      <InputGroup>
        <Input pr='16px' placeholder='לדוגמה: 7' type="number" value={customerHouseNumber} onChange={handleChange} />
        {
          renderLeftChildren()
        }
      </InputGroup>
      <FormErrorMessage>אנא מלאו מספר דירה</FormErrorMessage>
    </FormControl>
  )
}

const Address = ({ customerDetails, setIsValid }) => {
  const { consts } = useConsts()
  const [address, setAddress] = useState(customerDetails?.address || '')
  const [houseNumber, setHouseNumber] = useState(customerDetails?.houseNumber || '')
  const [isPrivateHouse, setIsPrivateHouse] = useState(customerDetails?.houseNumber === 0)
  const [isError, setIsError] = useState(false)

  const hasChanged = (
    customerDetails?.address !== address ||
    customerDetails?.houseNumber != houseNumber ||
    (isPrivateHouse && customerDetails?.houseNumber !== 0)
  )
  const isValid = useMemo(() => address && (houseNumber || isPrivateHouse), [address, houseNumber, isPrivateHouse])

  useEffect(() => {
    if (isValid && hasChanged) {
      setCustomerAddress(address, houseNumber).then((success) => {
        setIsError(!success)
        setIsValid(success)
      })
    } else {
      setIsValid(isValid)
    }
  }, [isValid])

  const onChangeIsPrivateHouse = ({ target }) => {
    const { checked } = target
    setIsPrivateHouse(checked)
    if (checked) {
      setHouseNumber(0)
    } else {
      setHouseNumber('')
    }
  }

  return (
    <VStack py='5' align='stretch' dir='rtl'>
      <Heading mb='2'>פרטי משלוח</Heading>
      <Text>
        {consts('delivery_address_note')}
      </Text>
      <AddressInput
        defaultValue={address}
        onChange={setAddress}
      />
      <FormControl display="flex" alignItems="center" >
        <FormLabel htmlFor="privateHouse" mb="0">
          בית פרטי
        </FormLabel>
        <Switch id="privateHouse" isChecked={isPrivateHouse} onChange={onChangeIsPrivateHouse} />
      </FormControl>
      {
        !isPrivateHouse &&
        <HouseNumberInput
          defaultValue={houseNumber}
          onChange={setHouseNumber}
        />
      }
      {
        isError &&
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>אירעה שגיאה בעדכון כתובת המשלוח</AlertTitle>
        </Alert>}
      {
        isValid && !isError &&
        <Box p='8' mt='50px' backgroundColor='gray.100' fontSize='20px'>
          ההזמנה תישלח
          <br />
          {`לרחוב ${address}`}
          <br />
          {!isPrivateHouse && `דירה מספר ${houseNumber} `}
        </Box>
      }
    </VStack >
  )
}

export default Address