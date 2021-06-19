import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import {
  Box, Center, FormControl, FormLabel,
  Text, Input, Button, Alert, AlertIcon
} from '@chakra-ui/react'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { login, isLoading, isAuth, touched } = useAuth()

  return (
    <Center dir='rtl' >
      <Box rounded='md' p='5' w='400px'>
        <Text mb='5' fontWeight='bold' fontSize='25px'>מסך מנהל</Text>
        <FormControl id="username">
          <FormLabel>שם משתמש</FormLabel>
          <Input type="username" onChange={({ target }) => setUsername(target.value)} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>סיסמה</FormLabel>
          <Input type="password" onChange={({ target }) => setPassword(target.value)} />
        </FormControl>
        <Button
          disabled={!username.length || !password.length}
          mt={4}
          colorScheme="pink"
          type="submit"
          onClick={() => login(username, password)}
          isLoading={isLoading}
          isFullWidth
        >
          התחבר
        </Button>
        {
          touched && !isAuth &&
          <Alert my='4' status="error" dir='rtl'>
            <AlertIcon />
            שם משתמש או סיסמה לא נכונים
          </Alert>
        }
      </Box>
    </Center >
  )
}

export default Login