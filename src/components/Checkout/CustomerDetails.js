import React, { useState, useEffect, useMemo } from 'react'

import {
  VStack, Heading, FormControl, FormLabel, Input, Stack,
  Box, Alert, AlertIcon, AlertTitle, Fade, FormErrorMessage
} from '@chakra-ui/react'

import { setCustomerDetails } from '../../utils/cart'

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const FULLNAME_REGEX = /^[a-z\u0590-\u05fe\s]+$/i
const NUMBER_REGEX = /^[0-9]*$/
const PHONE_REGEX = /^\d{10}$/

const Address = ({ customerDetails, setIsValid }) => {
  const [values, setValues] = useState({
    fullName: customerDetails?.fullName || '',
    email: customerDetails?.email || '',
    phoneNumber: customerDetails?.phoneNumber || ''
  })
  const [errors, setErrors] = useState({})
  const [isError, setIsError] = useState(false)

  const hasChanged = useMemo(() => {
    return Object.keys(values).some((key) => !customerDetails || values[key] !== customerDetails[key])
  }, [values, customerDetails])

  const isValid = useMemo(() => (
    !Object.values(errors).some(error => error) &&
    values.fullName &&
    values.email &&
    values.phoneNumber
  ), [errors, values])

  useEffect(() => {
    if (isValid && hasChanged) {
      setCustomerDetails(values.fullName, values.email, values.phoneNumber).then((success) => {
        setIsValid(success)
        setIsError(!success)
      })
    } else {
      setIsValid(isValid)
    }
  }, [isValid, values, hasChanged, setIsValid])

  const handleChangeFullName = ({ target }) => {
    const { value } = target
    if (value && !FULLNAME_REGEX.test(value)) return

    let error
    if (value.trim().split(/\s/g).length !== 2) {
      error = ' יש לציין שם ושם משפחה (2 מילים)'
    }
    setErrors((prev) => ({ ...prev, fullName: error }))
    setValues((prev) => ({ ...prev, fullName: error ? value : value.trim() }))
  }

  const handleChangeEmail = ({ target }) => {
    const { value } = target

    let error
    if (!EMAIL_REGEX.test(value)) {
      error = 'אימייל לא תקין'
    }
    setErrors((prev) => ({ ...prev, email: error }))
    setValues((prev) => ({ ...prev, email: value }))
  }

  const handleChangePhoneNumber = ({ target }) => {
    const { value } = target
    if (value && !NUMBER_REGEX.test(value)) return

    let error
    if (!PHONE_REGEX.test(value)) {
      error = 'מספר טלפון לא תקין'
    }
    setErrors((prev) => ({ ...prev, phoneNumber: error }))
    setValues((prev) => ({ ...prev, phoneNumber: value }))
  }

  return (
    <VStack py='5' align='stretch' dir='rtl'>
      <Heading mb='2'>פרטים עליכם</Heading>
      <Stack direction={{ base: 'column', md: 'row' }} spacing='8'>
        <Box flex='1'>
          <FormControl isInvalid={!!errors.fullName}>
            <FormLabel>שם מלא</FormLabel>
            <Input type='text' value={values.fullName} onChange={handleChangeFullName} placeholder='ישראל ישראלי' />
            <FormErrorMessage>{errors.fullName}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>כתובת אימייל</FormLabel>
            <Input type='email' value={values.email} onChange={handleChangeEmail} placeholder='הכנס כתובת אימייל' />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.phoneNumber}>
            <FormLabel>מספר טלפון</FormLabel>
            <Input type='number' value={values.phoneNumber} onChange={handleChangePhoneNumber} placeholder='הכנס מספר טלפון' />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box flex='1'>
          {
            isError &&
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>אירעה שגיאה בעדכון הפרטים שלך </AlertTitle>
            </Alert>
          }
          {
            isValid && !isError &&
            <Fade in>
              <Box p='8' backgroundColor='gray.100' fontSize='20px'>
                {`שם מלא:  ${values.fullName}`}
                <br />
                {`כתובת אימייל:  ${values.email}`}
                <br />
                {`טלפון:  ${values.phoneNumber}`}
              </Box>
            </Fade>
          }
        </Box>
      </Stack>
    </VStack >
  )
}

export default Address