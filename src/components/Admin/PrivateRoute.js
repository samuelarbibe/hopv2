import React, { useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { Center, Spinner } from '@chakra-ui/react'

import { useAuth } from '../../hooks/useAuth'

const PrivateRoute = ({ children, ...rest }) => {
  const { isAuth, checkIsAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(async () => {
    await checkIsAuth()
    setIsLoading(false)
  }, [])

  if (isLoading) return (
    <Center justifySelf='center' height='md'>
      <Spinner size='lg' />
    </Center>
  )

  return (
    <Route {...rest} render={() => {
      return isAuth
        ? children
        : <Redirect to='/login' />
    }} />
  )
}

export default PrivateRoute