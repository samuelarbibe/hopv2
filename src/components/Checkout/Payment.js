/* eslint-disable no-constant-condition */
import React, { useState, useEffect } from 'react'
import useSWR from 'swr'

import Iframe from 'react-iframe'
import { Redirect } from 'react-router-dom'
import { Alert, AlertIcon, AlertTitle, Center, Spinner } from '@chakra-ui/react'

import { cancelOrder } from '../../utils/orders'

const Payment = () => {
  const { data: paymentProcess, isLoading, isError } = useSWR('/api/orders/createOrder', { revalidateOnFocus: false })

  const [loadingError, setLoadingError] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleMessage = async (result) => {
    if (result.origin === 'https://meshulam.co.il' || result.origin === 'https://sandbox.meshulam.co.il') {
      switch (result.data.action) {
        case 'close': {
          document.getElementsByTagName('iframe')[0].style.setProperty('display', 'none')
          break
        }
        case 'payment': {
          if (result.data.status == 1) {
            setSuccess(true)
          }
          break
        }
        case 'failed_to_load_page': {
          await cancelOrder()
          setLoadingError(true)
          break
        }
      }
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage)

    return () => {
      if (!loadingError && !isError) cancelOrder()
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  if (success) return <Redirect to='/thankYou' />

  if (loadingError) return <Redirect to='/' />

  if (isError) return (
    <Alert status='error'>
      <AlertIcon />
      <AlertTitle>Could not load payment</AlertTitle>
    </Alert>
  )

  if (isLoading || !paymentProcess?.url) return (
    <Center justifySelf='center' height='md'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <Iframe url={paymentProcess.url} height='500px' />
  )
}

export default Payment